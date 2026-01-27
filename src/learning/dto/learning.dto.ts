import { Field, InputType, ObjectType, Int, ID } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
  @Field(() => ID)
  questionId: string;

  @Field()
  answer: string;
}

@InputType()
export class SubmitExerciseInput {
  @Field(() => ID)
  sessionId: string;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}

@ObjectType()
export class AnswerFeedback {
  @Field(() => ID)
  questionId: string;

  @Field()
  isCorrect: boolean;

  @Field({ nullable: true })
  correctAnswer?: string;
}

@ObjectType()
export class ExerciseResult {
  @Field(() => Int)
  score: number;

  @Field()
  passed: boolean;

  @Field(() => [AnswerFeedback])
  feedback: AnswerFeedback[];
}
