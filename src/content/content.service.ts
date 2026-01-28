import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonInput, LessonStatus } from './dto/content.dto';
import { Lesson } from '../learning/models/lesson.model';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // SSoT: ../../../docs/spec/modules/content.md #Lifecycle-Sequence
  async createLesson(
    userId: string,
    input: CreateLessonInput,
  ): Promise<Lesson> {
    const lesson = (await this.prisma.lesson.create({
      data: {
        ...input,
        status: LessonStatus.DRAFT,
        createdBy: userId,
      },
    })) as unknown as Lesson;
    return lesson;
  }

  // SSoT: ../../../docs/spec/modules/content.md #Publish-Content
  async publishLesson(lessonId: string, userId: string): Promise<Lesson> {
    const lesson = (await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: LessonStatus.PUBLISHED,
        publishedBy: userId,
        publishedAt: new Date(),
      },
    })) as unknown as Lesson;
    return lesson;
  }
}
