import { BaseEntity, Entity, ObjectIdColumn, Column } from 'typeorm';
import { Transform } from 'class-transformer';
import { ObjectID } from 'mongodb';

@Entity({
  name: 'cronjobs',
})
export class Cronjob extends BaseEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column({ nullable: false })
  taskName: string;

  @Column({ nullable: false })
  isRunning = false;

  @Column()
  lastRun: Date;

  @Column()
  metadata: any;
}
