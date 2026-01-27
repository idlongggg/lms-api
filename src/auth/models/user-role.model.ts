import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { User } from './user.model';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class UserRole {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => Role)
  role: Role;

  @Field()
  tenantId: string;

  @Field()
  assignedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
