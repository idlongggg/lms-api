import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TenantStatus } from '@prisma/client';
import { User } from '../../auth/models/user.model';
import GraphQLJSON from 'graphql-type-json';

registerEnumType(TenantStatus, {
  name: 'TenantStatus',
});

@ObjectType()
export class Tenant {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  domain?: string;

  @Field(() => TenantStatus)
  status: TenantStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  settings?: any;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [User], { nullable: true })
  users?: User[];
}
