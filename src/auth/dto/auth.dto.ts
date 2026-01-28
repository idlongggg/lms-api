import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';

@InputType()
export class DeviceInfoInput {
  @Field()
  deviceId: string;

  @Field()
  deviceName: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => DeviceInfoInput, { nullable: true })
  deviceInfo?: DeviceInfoInput;
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

  @Field(() => String, { defaultValue: 'STUDENT' }) // Defaulting to STUDENT if not provided, though Spec requires it.
  role: string;
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
