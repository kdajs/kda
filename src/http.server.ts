import * as Koa from 'koa'
import * as cors from '@koa/cors'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as staticServe from 'koa-static'
import * as chalk from 'chalk'
import * as http from 'http'

import { State } from './state'
import { Controllers } from './controller'
import { RouterDelegates } from './router'
import { createUploader } from './uploader'

export function createHttpServer ({
  state,
  controllers,
  routerDelegates
}: {
  /** 状态 */
  state: State
  /** 控制器 */
  controllers: Controllers
  /** 路由代理 */
  routerDelegates: RouterDelegates
}, port: number): Koa<State> {
  const app = new Koa<State>()
  const router = new Router()
  const uploader = createUploader(state.config.path.tmp)

  for (const delegate of routerDelegates) {
    delegate(router, controllers, uploader)
  }

  app
    .on('error', error => state.logger.error(error))
    .use(cors())

  for (const item of state.config.staticPath) {
    app.use(staticServe(item))
  }

  app
    .use(async (ctx, next) => {
      ctx.state = state
      await next()
    })
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())

  const server = http.createServer(app.callback())

  if (state.websocket !== undefined) {
    state.websocket.attach(server)
  }

  server.listen(port)

  // console output
  console.log(chalk.bold.magenta(`KDA Start ${port.toString()}\n`))

  return app
}
