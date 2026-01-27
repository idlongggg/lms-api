import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  tenantId: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
