import * as Router from 'koa-router'

import { State } from './state'

export type Controller<StateT extends State = State>
  = Router.IMiddleware<StateT>

export interface Controllers {
  [key: string]: Controller | {
    [key: string]: Controller
  }
}
