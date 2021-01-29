const Test2: RouterDelegate = (router, controllers) => {
  router.get('/test/2', controllers.Test.Test2)
}

export default Test2
