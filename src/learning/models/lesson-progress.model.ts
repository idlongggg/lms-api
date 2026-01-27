import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { ProgressStatus } from '@prisma/client';
import { Lesson } from './lesson.model';
import { User } from '../../auth/models/user.model';

registerEnumType(ProgressStatus, { name: 'ProgressStatus' });

@ObjectType()
export class LessonProgress {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  lessonId: string;

  @Field(() => ProgressStatus)
  status: ProgressStatus;

  @Field(() => Int)
  bestScore: number;

  @Field(() => Int)
  attempts: number;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Lesson)
  lesson?: Lesson;

  @Field(() => User)
  user?: User;
}
