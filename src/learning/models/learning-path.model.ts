import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/models/user.model';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class LearningPath {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  subjectId: string;

  @Field(() => GraphQLJSON, { description: 'JSON string of lessons' })
  lessons: any;

  @Field()
  generatedAt: Date;

  @Field()
  validUntil: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
