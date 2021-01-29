import { Config } from './config'
import { Models } from './model'
import { Logger } from './logger'
import { Websocket } from './websocket'

export interface State {
  config: Config
  models: Models
  logger: Logger
  websocket?: Websocket
}
