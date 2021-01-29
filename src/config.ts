import * as path from 'path'
import * as fs from 'fs'

export interface Config {
  path: {
    /** 程序执行的路径 */
    cwd: string
    /** 代码路径 */
    source: string
    /** 临时文件夹路径 */
    tmp: string
    /** 日志路径 */
    log: string
  }
  /** 静态资源路径 */
  staticPath: string[]
}

export function createConfig (options?: {
  /** 静态资源路径 */
  staticPath?: string[]
}): Config {
  const cwdPath = process.cwd()
  const sourcePath = path.resolve(cwdPath, 'dist')
  const tmpPath = path.resolve(cwdPath, 'tmp')
  const logPath = path.resolve(cwdPath, 'logs')

  !fs.existsSync(tmpPath) && fs.mkdirSync(tmpPath)
  !fs.existsSync(logPath) && fs.mkdirSync(logPath)

  const staticPath: string[] = []

  if (options !== undefined) {
    // build static path
    if (options.staticPath !== undefined) {
      for (const item of options.staticPath) {
        if (path.isAbsolute(item)) {
          staticPath.push(item)
        } else {
          const newStaticPathItem = path.resolve(cwdPath, item)
          fs.existsSync(newStaticPathItem) && staticPath.push(newStaticPathItem)
        }
      }
    }
  }

  const config = {
    path: {
      cwd: cwdPath,
      source: sourcePath,
      tmp: tmpPath,
      log: logPath
    },
    staticPath
  }

  return config
}
