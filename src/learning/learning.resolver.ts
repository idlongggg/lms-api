import { Resolver, Query, Args, ResolveField, Parent, Mutation, ID } from '@nestjs/graphql';
import { LearningService } from './learning.service';
import { Subject } from './models/subject.model';
import { Topic } from './models/topic.model';
import { Lesson } from './models/lesson.model';
import { Question } from './models/question.model';
import { LessonProgress } from './models/lesson-progress.model';
import { SubmitExerciseInput, ExerciseResult } from './dto/learning.dto';

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

  @Mutation(() => LessonProgress)
  async completeLesson(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('lessonId', { type: () => ID }) lessonId: string,
  ) {
    return this.learningService.completeLesson(userId, lessonId);
  }

  @Mutation(() => ExerciseResult)
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
