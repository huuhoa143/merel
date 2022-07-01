import { Transform } from 'class-transformer';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({
  name: 'sessions',
})
export class SessionEntity extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  sessionId: string;

  @Column({ nullable: false })
  accessToken: string;

  @Column()
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date = new Date();
}
