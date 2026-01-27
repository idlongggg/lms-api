import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { LessonStatus } from '@prisma/client';
import { Topic } from './topic.model';
import { Question } from './question.model';

registerEnumType(LessonStatus, { name: 'LessonStatus' });

@ObjectType()
export class Lesson {
  @Field(() => ID)
  id: string;

  @Field()
  topicId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => LessonStatus)
  status: LessonStatus;

  @Field(() => Int)
  passingScore: number;

  @Field(() => Int)
  estimatedMinutes: number;

  @Field()
  createdBy: string;

  @Field({ nullable: true })
  publishedBy?: string;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Topic)
  topic?: Topic;

  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}
