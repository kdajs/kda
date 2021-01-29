import * as Redis from 'ioredis'

export function createRedis (options: {
  port: number
  host: string
  password: string
  db: number
}): Redis.Redis {
  const redis = new Redis({
    ...options,
    family: 4
  })
  return redis
}

export function createRedisSentinels (options: {
  name: string
  sentinels: Array<{
    host: string
    port: number
  }>
}): Redis.Redis {
  const redis = new Redis(options)
  return redis
}
