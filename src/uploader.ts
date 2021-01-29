import * as path from 'path'
import * as multer from '@koa/multer'
import * as shortid from 'shortid'

export type Uploader = multer.Instance

export function createUploader (uploadPath: string): Uploader {
  return multer({
    storage: multer.diskStorage({
      destination (req, file, cb) {
        cb(null, uploadPath)
      },
      filename (req, file, cb) {
        const extname = path.extname(file.originalname)
        const timestamp = Date.now()
        const id = shortid.generate()
        cb(null, `${timestamp}${id}${extname}`)
      }
    })
  })
}
