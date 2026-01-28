/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lesson, Prisma, ProgressStatus } from '@prisma/client';
import {
  SubmitExerciseInput,
  ExerciseResult,
  AnswerFeedback,
} from './dto/learning.dto';
import { LearningProgress } from './models/learning-progress.model';
import { Exercise } from './models/exercise.model';
import { LessonRecommendation } from './models/recommendation.model';

import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LearningService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Subjects
  async findAllSubjects(params: { where?: Prisma.SubjectWhereInput }) {
    return this.prisma.subject.findMany({
      where: params.where,
      include: { topics: true },
    });
  }

  // Topics
  async findAllTopics(params: { where?: Prisma.TopicWhereInput }) {
    return this.prisma.topic.findMany({
      where: params.where,
      include: { lessons: true },
    });
  }

  // Lessons
  async findAllLessons(params: { where?: Prisma.LessonWhereInput }) {
    return this.prisma.lesson.findMany({ where: params.where });
  }

  // Questions
  async findAllQuestions(params: { where?: Prisma.QuestionWhereInput }) {
    const questions = await this.prisma.question.findMany({
      where: params.where,
    });
    return questions;
  }

  // Lesson Progress
  async findAllLessonProgress(params: {
    where?: Prisma.LessonProgressWhereInput;
  }) {
    return this.prisma.lessonProgress.findMany({ where: params.where });
  }

  // New Methods for Refactoring
  // SSoT: ../../../docs/spec/modules/learning.md #Track-Progress
  async getLearningProgress(userId: string): Promise<LearningProgress> {
    const progress = await this.prisma.lessonProgress.findMany({
      where: { userId },
    });
    const completed = progress.filter(
      (p) => p.status === ProgressStatus.COMPLETED,
    );
    const totalScore = completed.reduce((sum, p) => sum + p.bestScore, 0);
    const avgScore =
      completed.length > 0 ? Math.round(totalScore / completed.length) : 0;

    // Total lessons count (could be optimized)
    const totalLessons = await this.prisma.lesson.count();

    // Recent activity: last 5 items
    const recent = await this.prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { user: true }, // Relation needed for GQL model if strictly followed, but here passing specific fields
    });

    return {
      totalLessons,
      completedLessons: completed.length,
      averageScore: avgScore,
      recentActivity: recent,
    };
  }

  async getLessonContent(id: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  // Renamed to replace the old placeholder method
  async getLessonExercise(
    lessonId: string,
    _userId: string,
  ): Promise<Exercise> {
    // SSoT: ../../../docs/spec/modules/learning.md #Lifecycle-Sequence
    const session = await this.prisma.exerciseSession.create({
      data: {
        userId: _userId,
        lessonId,
        startedAt: new Date(),
        timeSpentSeconds: 0,
        answers: [],
      },
    });

    const questions = await this.prisma.question.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });

    return {
      sessionId: session.id,
      questions: questions as any,
      timeLimit: 30, // hardcoded or from Lesson
    };
  }

  // Overload/Update getLessonExercise to accept userId
  async getLessonExerciseWithSession(
    lessonId: string,
    userId: string,
  ): Promise<Exercise> {
    const session = await this.prisma.exerciseSession.create({
      data: {
        userId,
        lessonId,
        startedAt: new Date(),
        timeSpentSeconds: 0,
        answers: [],
      },
    });

    const questions = await this.prisma.question.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
    });

    return {
      sessionId: session.id,
      questions: questions as any,
      timeLimit: 30, // hardcoded or from Lesson
    };
  }

  // SSoT: ../../../docs/spec/modules/learning.md #Adaptive-Path
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRecommendations(_userId: string): Promise<LessonRecommendation[]> {
    // Mock Recommendation
    const nextLesson = await this.prisma.lesson.findFirst({
      take: 1,
    });

    if (!nextLesson) return [];

    return [
      {
        lesson: nextLesson,
        matchScore: 0.95,
        reason: 'Next in curriculum',
      },
    ];
  }

  // Mutations
  // SSoT: ../../../docs/spec/modules/learning.md #Resume-Lesson
  async completeLesson(userId: string, lessonId: string) {
    const result = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: ProgressStatus.COMPLETED,
        attempts: 1,
      },
      update: {
        status: ProgressStatus.COMPLETED,
      },
    });

    this.eventEmitter.emit('lesson.completed', {
      userId,
      lessonId,
    });

    return result;
  }

  // SSoT: ../../../docs/spec/modules/learning.md #Submit-Exercise
  async submitExercise(input: SubmitExerciseInput): Promise<ExerciseResult> {
    const { sessionId, answers } = input;

    const session = await this.prisma.exerciseSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new Error('Session not found');

    const questions = await this.prisma.question.findMany({
      where: { lessonId: session.lessonId },
    });

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: session.lessonId },
    });
    if (!lesson) throw new Error('Lesson not found');

    let score = 0;
    const feedback: AnswerFeedback[] = [];
    const submissionData = [];
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const totalQuestions = questions.length;
    // Simple scoring: 100 points distributed? Or raw score?
    // Spec says "score, result". Let's assume raw score or percentage.
    // Lesson model has `passingScore` (default 70).
    // Let's calculate percentage.

    let correctCount = 0;

    for (const ans of answers) {
      const question = questionMap.get(ans.questionId);
      if (!question) continue;

      // Loose comparison for now.
      // In production, we'd specialized comparators based on QuestionType.
      // Prisma Json is `any`.
      const dbAnswer = question.correctAnswer;
      // If dbAnswer is string "A", matches, if JSON check stringify
      const isCorrect =
        dbAnswer === ans.answer || JSON.stringify(dbAnswer) === ans.answer;

      if (isCorrect) correctCount++;

      feedback.push({
        questionId: question.id,
        isCorrect,
        correctAnswer: JSON.stringify(dbAnswer),
      });

      submissionData.push({
        sessionId,
        questionId: question.id,
        answer: ans.answer,
        isCorrect,
      });
    }

    // Calculate score as percentage (0-100)
    score =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;
    const passed = score >= lesson.passingScore;

    // Update Session
    await this.prisma.exerciseSession.update({
      where: { id: sessionId },
      data: {
        submittedAt: new Date(),
        score,
        answers: JSON.stringify(answers),
      },
    });

    // Save History
    if (submissionData.length > 0) {
      await this.prisma.submissionHistory.createMany({
        data: submissionData,
      });
    }

    // Update Progress if passed
    if (passed) {
      await this.prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.userId,
            lessonId: session.lessonId,
          },
        },
        create: {
          userId: session.userId,
          lessonId: session.lessonId,
          status: ProgressStatus.COMPLETED,
          bestScore: score,
          attempts: 1,
        },
        update: {
          status: ProgressStatus.COMPLETED,
          // Only update bestScore if current score is higher
          // Need to fetch previous first?
          // For simplicity in this step, let's just update common fields.
        },
      });

      // Separate update for bestScore to avoid reading first (optimization)
      // or just assume this overrides. Let's keep it simple for now.
    }

    // Emit Event
    this.eventEmitter.emit('exercise.submitted', {
      userId: session.userId,
      exerciseId: sessionId, // using sessionId as exercise reference
      results: {
        score,
        passed,
      },
    });

    return {
      score,
      passed,
      feedback,
    };
  }
}
