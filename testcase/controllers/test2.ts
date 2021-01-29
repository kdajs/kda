const Test2: Controller = (ctx, next) => {
  ctx.throw(401, '我是异常响应')

  console.log('我是不能被执行的')
}

export default Test2
