import User from '../models/user'

const Test1: Controller = async (ctx, next) => {
  ctx.state.logger.trace('我是日志')
  console.log(ctx.state.utils.today())
  // console.log(ctx.state.config.path)

  const users = await ctx.state.models.User.find()

  const timestamp = new Date().getTime()
  const user = new User()
  user.id = 1
  user.code = timestamp
  user.name = 'KDA'
  await ctx.state.models.User.save(user)

  const updateUser = users[3]

  if (updateUser !== undefined) {
    updateUser.name = 'KDA'
    updateUser.code = updateUser.code + 1
    await ctx.state.models.User.save(updateUser)
  }

  console.log(await ctx.state.models.User.find())

  ctx.body = 'Hello, KDA!'
}

export default Test1
