import 'reflect-metadata'
import { createConnection, Repository } from 'typeorm'

export type Model<T> = Repository<T>

export interface Models {
  [key: string]: Model<any>
}

export async function createModels<ModelsT = Models> (options: {
  host: string
  port: number
  username: string
  password: string
  database: string
  entities: {
    [key: string]: Function
  }
  logging?: boolean
}): Promise<ModelsT> {
  const { host, port, username, password, database, entities, logging } = options
  return await new Promise(resolve => {
    createConnection({
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      entities: Object.values(entities),
      synchronize: false,
      logging: logging === true
    }).then(connection => {
      const models = Object()
      for (const key of Object.keys(entities)) {
        models[key] = connection.getRepository(entities[key])
      }
      resolve(models)
    }).catch(error => console.log(error))
  })
}
