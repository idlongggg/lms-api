import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserStatus, Role } from '@prisma/client';
import { Tenant } from '../../tenant/models/tenant.model';
import { UserRole } from './user-role.model';
import { UserSession } from './user-session.model';
import { LearningPath } from '../../learning/models/learning-path.model';
import { LessonProgress } from '../../learning/models/lesson-progress.model';
import { ExerciseSession } from '../../learning/models/exercise-session.model';
import { UserBadge } from '../../gamification/models/user-badge.model';

registerEnumType(UserStatus, { name: 'UserStatus' });
registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => Tenant)
  tenant?: Tenant;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field(() => [UserRole], { nullable: true })
  roles?: UserRole[];

  @Field(() => [UserSession], { nullable: true })
  sessions?: UserSession[];

  @Field(() => [LearningPath], { nullable: true })
  learningPaths?: LearningPath[];

  @Field(() => [LessonProgress], { nullable: true })
  lessonProgress?: LessonProgress[];

  @Field(() => [ExerciseSession], { nullable: true })
  exerciseSessions?: ExerciseSession[];

  @Field(() => [UserBadge], { nullable: true })
  userBadges?: UserBadge[];
}
