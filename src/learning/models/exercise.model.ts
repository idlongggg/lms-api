import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Question } from './question.model';

@ObjectType()
export class Exercise {
  @Field(() => ID)
  sessionId: string;

  @Field(() => [Question])
  questions: Question[];

  @Field(() => Int, { nullable: true })
  timeLimit?: number;
}
