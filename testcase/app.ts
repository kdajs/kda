import controllers from './controllers'
import routerDelegates from './router.delegates'
import createModels from './models'
import utils from './utils'
import createUDPSocketClients from './udp.socket.clients'
import {
  createConfig,
  createLogger,
  createHttpServer,
  createWebsocket
} from '../src/kda'
import { setInterval } from 'timers'

// 启动服务
const startServer = async (): Promise<void> => {
  const config = createConfig({
    staticPath: ['./static']
  })

  const websocket = createWebsocket()
  websocket.on('connection', socket => {
    console.log('websocket connection')
    setInterval(() => {
      socket.emit('event', 'message')
    }, 5000)
  })

  const logger = createLogger(config.path.log)
  const models = await createModels()
  const commonState: CommonState = { config, models, logger, websocket, utils }
  const udpSocketClients = createUDPSocketClients(commonState)
  const httpState: HttpState = { ...commonState, udpSocketClients }

  createHttpServer({
    state: httpState,
    controllers,
    routerDelegates
  }, 3000)
}

startServer()
  .catch(error => console.log(error))
