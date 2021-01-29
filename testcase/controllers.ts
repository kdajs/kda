import Test1 from './controllers/test1'
import Test2 from './controllers/test2'
import Upload from './controllers/upload'

const controllers: Controllers = {
  Upload,
  Test: {
    Test1,
    Test2
  }
}

export default controllers
