import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/models/user.model';

@ObjectType()
export class LearningPath {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  subjectId: string;

  @Field({ description: 'JSON string of lessons' })
  lessons: string;

  @Field()
  generatedAt: Date;

  @Field()
  validUntil: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
