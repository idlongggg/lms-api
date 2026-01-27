import { Module } from '@nestjs/common';
import {
  LearningResolver,
  LessonResolver,
  QuestionResolver,
  LessonProgressResolver,
} from './learning.resolver';
import { LearningService } from './learning.service';

@Module({
  providers: [
    LearningResolver,
    LessonResolver,
    QuestionResolver,
    LessonProgressResolver,
    LearningService,
  ],
  exports: [LearningService],
})
export class LearningModule {}
