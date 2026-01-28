import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Lesson } from './lesson.model';

@ObjectType()
export class LessonRecommendation {
  @Field(() => Lesson)
  lesson: Lesson;

  @Field({ nullable: true })
  reason?: string;

  @Field(() => Float)
  matchScore: number;
}
