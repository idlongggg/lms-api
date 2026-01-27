import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { QuestionType } from '@prisma/client';
import { Lesson } from './lesson.model';

registerEnumType(QuestionType, { name: 'QuestionType' });

@ObjectType()
export class Question {
  @Field(() => ID)
  id: string;

  @Field()
  lessonId: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field()
  content: string;

  @Field({ description: 'JSON string of options' })
  options: string;

  @Field({ description: 'JSON string of correct answer' })
  correctAnswer: string;

  @Field({ nullable: true })
  explanation?: string;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field(() => Lesson)
  lesson?: Lesson;
}
