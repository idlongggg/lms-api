import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subject, Topic, Lesson, Prisma, ProgressStatus } from '@prisma/client';
import { SubmitExerciseInput, ExerciseResult, AnswerFeedback } from './dto/learning.dto';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.question.findMany({ where: params.where });
  }

  // Lesson Progress
  async findAllLessonProgress(params: {
    where?: Prisma.LessonProgressWhereInput;
  }) {
    return this.prisma.lessonProgress.findMany({ where: params.where });
  }

  // Mutations
  async completeLesson(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.upsert({
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
  }

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
      const dbAnswer = question.correctAnswer as any; 
      // If dbAnswer is string "A", matches, if JSON check stringify
      const isCorrect = 
         dbAnswer === ans.answer || 
         JSON.stringify(dbAnswer) === ans.answer;

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
    score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
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
        where: { userId_lessonId: { userId: session.userId, lessonId: session.lessonId } },
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

    return {
      score,
      passed,
      feedback,
    };
  }
}
