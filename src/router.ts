import * as Router from 'koa-router'

import { Controllers } from './controller'
import { Uploader } from './uploader'

export type RouterDelegate<ControlersT extends Controllers = Controllers> =
  (router: Router, controllers: ControlersT, uploader: Uploader) => void

export type RouterDelegates = RouterDelegate[]
