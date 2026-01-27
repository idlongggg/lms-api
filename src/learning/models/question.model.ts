import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { QuestionType } from '@prisma/client';
import { Lesson } from './lesson.model';
import GraphQLJSON from 'graphql-type-json';

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

  @Field(() => GraphQLJSON, { description: 'JSON string of options' })
  options: any;

  @Field(() => GraphQLJSON, { description: 'JSON string of correct answer' })
  correctAnswer: any;

  @Field({ nullable: true })
  explanation?: string;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field(() => Lesson)
  lesson?: Lesson;
}
