import { Field, InputType, ID, registerEnumType, Int } from '@nestjs/graphql';

export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(LessonStatus, { name: 'LessonStatus' });

@InputType()
export class CreateLessonInput {
  @Field(() => ID)
  topicId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Int, { defaultValue: 70 })
  passingScore: number;

  @Field(() => Int, { defaultValue: 30 })
  estimatedMinutes: number;
}
