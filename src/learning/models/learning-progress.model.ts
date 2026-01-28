import { Field, ObjectType, Int } from '@nestjs/graphql';
import { LessonProgress } from './lesson-progress.model';

@ObjectType()
export class LearningProgress {
  @Field(() => Int)
  totalLessons: number;

  @Field(() => Int)
  completedLessons: number;

  @Field(() => Int)
  averageScore: number;

  @Field(() => [LessonProgress])
  recentActivity: LessonProgress[];
}
