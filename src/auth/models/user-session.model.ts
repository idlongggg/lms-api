import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class UserSession {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  deviceId: string;

  @Field()
  deviceName: string;

  @Field()
  refreshToken: string;

  @Field()
  isActive: boolean;

  @Field()
  lastActiveAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  expiresAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
