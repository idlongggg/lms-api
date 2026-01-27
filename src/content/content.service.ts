import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonInput, LessonStatus } from './dto/content.dto';
import { Lesson } from '../learning/models/lesson.model';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async createLesson(
    userId: string,
    input: CreateLessonInput,
  ): Promise<Lesson> {
    return this.prisma.lesson.create({
      data: {
        ...input,
        status: LessonStatus.DRAFT,
        createdBy: userId,
      },
    }) as unknown as Lesson;
  }

  async publishLesson(lessonId: string, userId: string): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: LessonStatus.PUBLISHED,
        publishedBy: userId,
        publishedAt: new Date(),
      },
    }) as unknown as Lesson;
  }
}
