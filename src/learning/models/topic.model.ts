import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Subject } from './subject.model';
import { Lesson } from './lesson.model';

@ObjectType()
export class Topic {
  @Field(() => ID)
  id: string;

  @Field()
  subjectId: string;

  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field(() => Subject)
  subject?: Subject;

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[];
}
