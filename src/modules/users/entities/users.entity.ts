import { classToPlain, Exclude, Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  @Exclude()
  password: string;

  @Column({ default: null })
  authToken: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();

  toJSON() {
    return classToPlain(this);
  }
}
