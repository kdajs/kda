import { createModels } from '../src/kda'
import User from './models/user'
import dbConfig from './db.config'

const testConfig = {
  host: dbConfig.host,
  port: 3306,
  username: dbConfig.username,
  password: dbConfig.password,
  database: 'test'
}

const productionConfig = {
  host: dbConfig.host,
  port: 3306,
  username: dbConfig.username,
  password: dbConfig.password,
  database: 'test'
}

const getDBConfig = (): {
  host: string
  port: number
  username: string
  password: string
  database: string
} => {
  switch (process.env.NODE_ENV) {
    case NODE_ENV.Production:
      return productionConfig
    default:
      return testConfig
  }
}

export default async function (): Promise<Models> {
  return await new Promise(resolve => {
    resolve(createModels<Models>({
      ...getDBConfig(),
      entities: {
        User
      }
    }))
  })
}
