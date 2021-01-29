const Upload: Controller = ctx => {
  console.log(ctx.request.files)
  ctx.status = 200
}

export default Upload
