import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  code: number

  // @Column()
  // time: string
}
