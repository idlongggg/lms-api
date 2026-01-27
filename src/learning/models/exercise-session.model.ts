import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { User } from '../../auth/models/user.model';

@ObjectType()
export class ExerciseSession {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  lessonId: string;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  submittedAt?: Date;

  @Field(() => Int, { nullable: true })
  score?: number;

  @Field(() => Int)
  timeSpentSeconds: number;

  @Field({ description: 'JSON string of answers' })
  answers: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
