import * as socketio from 'socket.io'

export type Websocket = socketio.Server

export function createWebsocket (options?: socketio.ServerOptions): Websocket {
  if (options !== undefined && options.transports === undefined) {
    options.transports = ['websocket']
  }

  return new socketio.Server(options)
}
