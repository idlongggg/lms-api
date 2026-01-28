import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Lesson } from '../learning/models/lesson.model';
import { CreateLessonInput } from './dto/content.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/rbac.config';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver(() => Lesson)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.CONTENT_CREATE)
  // SSoT: ../../../docs/spec/modules/content.md #Lifecycle-Sequence
  async createLesson(
    @CurrentUser() user: User,
    @Args('input') input: CreateLessonInput,
  ) {
    return this.contentService.createLesson(user.id, input);
  }

  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.CONTENT_PUBLISH)
  // SSoT: ../../../docs/spec/modules/content.md #Publish-Content
  async publishLesson(
    @Args('lessonId', { type: () => ID }) lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.contentService.publishLesson(lessonId, user.id);
  }
}
