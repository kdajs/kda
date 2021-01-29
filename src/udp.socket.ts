import { State } from './state'
import * as dgram from 'dgram'
import * as shortid from 'shortid'

type UDPSocketCallbackComplete = (data: any) => void
type UDPSocketCallbackError = (error: string) => void

export type UDPSocketDelegate<StateT extends State = State>
  = (state: StateT, params: any, callbackComplete: UDPSocketCallbackComplete, callbackError: UDPSocketCallbackError) => void

export interface UDPSocketDelegates {
  [path: string]: UDPSocketDelegate<State>
}

const enum UDPSocketMessageType {
  null = 0,
  request = 1,
  response = 2
}

interface UDPSocketMessage {
  type: UDPSocketMessageType
  uuid: string
  path: string
  error: undefined | string
  data: any
}

function parseMessage (message: string): UDPSocketMessage {
  try {
    return JSON.parse(message.toString())
  } catch (error) {}
  return { type: UDPSocketMessageType.null, uuid: '', path: '', error: 'parse message error', data: undefined }
}

export function createUDPSocketServer ({
  state,
  port,
  delegates
}: {
  state: State
  port: number
  delegates: UDPSocketDelegates
}): dgram.Socket {
  const server = dgram.createSocket('udp4')

  server.on('message', (messagebuf, remote: dgram.RemoteInfo): void => {
    const message = parseMessage(messagebuf.toString())

    if (message.type === UDPSocketMessageType.request) {
      UDPSocketRequestManager({
        state,
        server,
        delegates,
        message,
        remote
      })
    }
    if (message.type === UDPSocketMessageType.response) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      UDPSocketResponseManager({ message })
    }
  })

  server.bind(port)

  return server
}

export type UDPSocketClient = (path: string, params: any) => Promise<any>

export interface UDPSocketClients {
  [key: string]: UDPSocketClient
}

const $responseResolve: {
  [key: string]: Function
} = {}
const $responseReject: {
  [key: string]: Function
} = {}
const $requestTimer: {
  [key: string]: NodeJS.Timeout
} = {}
const $requestTimeout = 30 * 1000

export const createUDPSocketClient = ({
  server,
  host = '127.0.0.1',
  port
}: {
  server: dgram.Socket
  host?: string
  port: number
}): UDPSocketClient => {
  const client: UDPSocketClient = async (path, params) => await new Promise((resolve, reject) => {
    const uuid = Date.now().toString() + shortid.generate()

    $responseResolve[uuid] = resolve
    $responseReject[uuid] = reject

    const message: UDPSocketMessage = {
      type: UDPSocketMessageType.request,
      uuid,
      error: undefined,
      path,
      data: params
    }

    server.send(
      Buffer.from(JSON.stringify(message)),
      port,
      host
    )

    $requestTimer[uuid] = setTimeout(() => {
      const message: UDPSocketMessage = {
        type: UDPSocketMessageType.response,
        uuid,
        path,
        error: 'timeout',
        data: undefined
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      UDPSocketResponseManager({ message })
    }, $requestTimeout)
  })

  return client
}

function UDPSocketRequestManager ({
  state,
  server,
  delegates,
  message,
  remote
}: {
  state: State
  server: dgram.Socket
  delegates: UDPSocketDelegates
  message: UDPSocketMessage
  remote: dgram.RemoteInfo
}): void {
  const { path, data, uuid } = message

  const callbackComplete: UDPSocketCallbackComplete = (data: any): void => {
    const responseMessage: UDPSocketMessage = {
      type: UDPSocketMessageType.response,
      error: undefined,
      uuid,
      data,
      path
    }
    const messageBuf = Buffer.from(JSON.stringify(responseMessage))
    server.send(messageBuf, 0, messageBuf.length, remote.port, remote.address)
  }

  const callbackError: UDPSocketCallbackError = (error: string): void => {
    const responseMessage: UDPSocketMessage = {
      type: UDPSocketMessageType.response,
      error,
      uuid,
      data,
      path
    }
    const messageBuf = Buffer.from(JSON.stringify(responseMessage))
    server.send(messageBuf, 0, messageBuf.length, remote.port, remote.address)
  }

  let delegate: undefined | UDPSocketDelegate<State>
  for (const item of Object.keys(delegates)) {
    if (item === path) {
      delegate = delegates[item]
    }
  }

  if (delegate !== undefined) {
    delegate(state, data, callbackComplete, callbackError)
  } else {
    callbackError('path delegate undefined')
  }
}

async function UDPSocketResponseManager ({
  message
}: {
  message: UDPSocketMessage
}): Promise<void> {
  const { data, uuid, error } = message

  if (error !== undefined && $responseReject[uuid] !== undefined) {
    $responseReject[uuid](error)
  } else if ($responseResolve[uuid] !== undefined) {
    $responseResolve[uuid](data)
  }

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  $responseReject[uuid] !== undefined && delete $responseReject[uuid]
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  $responseResolve[uuid] !== undefined && delete $responseResolve[uuid]
  $requestTimer[uuid] !== undefined && clearTimeout($requestTimer[uuid])
}
