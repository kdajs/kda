import { Test1 } from './udp.socket.delegates/test'
import { createUDPSocketServer, createUDPSocketClient } from '../src/kda'

const udpSocketDelegates: UDPSocketDelegates = {
  '/socket/test/1': Test1
}

export default function createUDPSocketClients (state: CommonState): UDPSocketClients {
  const udpSocketServer = createUDPSocketServer({
    state,
    port: 3001,
    delegates: udpSocketDelegates
  })

  const udpSocketClient = createUDPSocketClient({
    server: udpSocketServer,
    port: 3001
  })

  const udpSocketClients: UDPSocketClients = {
    Test: udpSocketClient
  }

  setTimeout(() => {
    udpSocketClient('/socket/test/1', 'sksksk')
      .then(data => console.log('获得返回', data))
      .catch(error => console.log('获取错误', error))
  }, 3000)

  return udpSocketClients
}
