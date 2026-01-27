import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Lesson } from '../learning/models/lesson.model';
import { CreateLessonInput } from './dto/content.dto';

@Resolver(() => Lesson)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Lesson)
  async createLesson(
    @Args('userId', { type: () => ID }) userId: string, // Temporary: explicit userId until AuthGuard
    @Args('input') input: CreateLessonInput,
  ) {
    return this.contentService.createLesson(userId, input);
  }

  @Mutation(() => Lesson)
  async publishLesson(
    @Args('lessonId', { type: () => ID }) lessonId: string,
    @Args('userId', { type: () => ID }) userId: string, // Temporary
  ) {
    return this.contentService.publishLesson(lessonId, userId);
  }
}
