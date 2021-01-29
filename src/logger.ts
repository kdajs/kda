import * as path from 'path'
import * as log4js from 'log4js'

export type Logger = log4js.Logger

export function createLogger (logPath: string): log4js.Logger {
  const options: log4js.Configuration = {
    appenders: {
      default: { type: 'console' },
      file: {
        type: 'dateFile',
        filename: path.resolve(logPath, 'kda'),
        pattern: '.yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: {
        appenders: ['default', 'file'],
        level: 'all'
      }
    }
  }

  // TODO 多进程日志读写

  log4js.configure(options)

  const processLogger = log4js.getLogger('[PROCESS]')
  process.on('uncaughtException', error => processLogger.error(error))
  process.on('unhandledRejection', (reason, p) => processLogger.error(reason, p))

  return log4js.getLogger('[KDA]')
}
