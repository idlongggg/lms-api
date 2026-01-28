import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  ID,
} from '@nestjs/graphql';
import { LearningService } from './learning.service';
import { Subject } from './models/subject.model';
import { Topic } from './models/topic.model';
import { Lesson } from './models/lesson.model';
import { Question } from './models/question.model';
import { LessonProgress } from './models/lesson-progress.model';
import { LearningProgress } from './models/learning-progress.model';
import { Exercise } from './models/exercise.model';
import { LessonRecommendation } from './models/recommendation.model';
import { SubmitExerciseInput, ExerciseResult } from './dto/learning.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver(() => Subject)
export class LearningResolver {
  constructor(private readonly learningService: LearningService) {}

  @Query(() => [Subject], { name: 'subjects' })
  async getSubjects() {
    return this.learningService.findAllSubjects({});
  }

  @Query(() => [Topic], { name: 'topics' })
  async getTopics() {
    return this.learningService.findAllTopics({});
  }

  @Query(() => [Lesson], { name: 'lessons' })
  async getLessons() {
    return this.learningService.findAllLessons({});
  }

  // Refactor: Add SSoT keys
  @Query(() => LearningProgress, { name: 'learningProgress' })
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/learning.md #Track-Progress
  async getLearningProgress(@CurrentUser() user: User) {
    return this.learningService.getLearningProgress(user.id);
  }

  @Query(() => Lesson, { name: 'lessonContent' })
  async getLessonContent(@Args('id', { type: () => ID }) id: string) {
    return this.learningService.getLessonContent(id);
  }

  @Query(() => Exercise, { name: 'lessonExercise' })
  @UseGuards(GqlAuthGuard)
  async getLessonExercise(
    @CurrentUser() user: User,
    @Args('lessonId', { type: () => ID }) lessonId: string,
  ) {
    // SSoT: ../../../docs/spec/modules/learning.md #Lifecycle-Sequence
    return this.learningService.getLessonExercise(lessonId, user.id);
  }

  @Query(() => [LessonRecommendation], { name: 'recommendations' })
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/learning.md #Adaptive-Path
  async getRecommendations(@CurrentUser() user: User) {
    return this.learningService.getRecommendations(user.id);
  }

  @Mutation(() => LessonProgress)
  @UseGuards(GqlAuthGuard)
  async completeLesson(
    @CurrentUser() user: User,
    @Args('lessonId', { type: () => ID }) lessonId: string,
  ) {
    // SSoT: ../../../docs/spec/modules/learning.md #Resume-Lesson
    return this.learningService.completeLesson(user.id, lessonId);
  }

  @Mutation(() => ExerciseResult)
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/learning.md #Submit-Exercise
  async submitExercise(@Args('input') input: SubmitExerciseInput) {
    return this.learningService.submitExercise(input);
  }
}

@Resolver(() => Lesson)
export class LessonResolver {
  constructor(private readonly learningService: LearningService) {}

  @ResolveField(() => [Question])
  async questions(@Parent() lesson: Lesson) {
    return this.learningService.findAllQuestions({
      where: { lessonId: lesson.id },
    });
  }
}

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly learningService: LearningService) {}

  @Query(() => [Question], { name: 'questions' })
  async getQuestions() {
    return this.learningService.findAllQuestions({});
  }
}

@Resolver(() => LessonProgress)
export class LessonProgressResolver {
  constructor(private readonly learningService: LearningService) {}

  @Query(() => [LessonProgress], { name: 'lessonProgresses' })
  async getLessonProgresses() {
    return this.learningService.findAllLessonProgress({});
  }
}
