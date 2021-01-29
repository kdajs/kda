import * as KDA from '../src/kda'
import User from './models/user'

declare global {
  const enum NODE_ENV {
    Development = 'development',
    Test = 'test',
    Production = 'production'
  }

  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      NODE_ENV: NODE_ENV
    }
  }

  interface Utils {
    today: () => string
  }

  interface Models extends KDA.Models {
    User: KDA.Model<User>
  }

  interface CommonState extends KDA.State {
    websocket: KDA.Websocket
    models: Models
    utils: Utils
  }

  // UDP Socket
  type UDPSocketClient = KDA.UDPSocketClient
  interface UDPSocketClients extends KDA.UDPSocketClients {
    Test: UDPSocketClient
  }
  type UDPSocketDelegate = KDA.UDPSocketDelegate<CommonState>
  type UDPSocketDelegates = KDA.UDPSocketDelegates

  // Http
  interface HttpState extends CommonState {
    udpSocketClients: UDPSocketClients
  }

  type Controller = KDA.Controller<HttpState>

  interface Controllers extends KDA.Controllers {
    Upload: Controller
    Test: {
      Test1: Controller
      Test2: Controller
    }
  }

  type RouterDelegate = KDA.RouterDelegate<Controllers>
  type RouterDelegates = KDA.RouterDelegates
}
