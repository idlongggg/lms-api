import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TenantStatus } from '@prisma/client';
import { User } from '../../auth/models/user.model';

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

  // settings is JSON, often handled as String or custom Scalar in GraphQL
  // For simplicity we can use String or GraphQLJSON if we install graphql-type-json
  @Field({ nullable: true })
  settings?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [User], { nullable: true })
  users?: User[];
}
