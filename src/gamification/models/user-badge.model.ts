import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/models/user.model';

@ObjectType()
export class UserBadge {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  badgeId: string;

  @Field()
  awardedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
