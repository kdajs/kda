const Test1: RouterDelegate = (router, controllers, uploader) => {
  router.get('/test/1', controllers.Test.Test1)
  router.post('/upload', uploader.single('image'), controllers.Upload)
}

export default Test1
