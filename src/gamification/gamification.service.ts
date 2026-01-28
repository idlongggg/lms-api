import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserProfile,
  RewardRedemption,
  // Reward, // Reward is separate model? Or Prisma?
  // Use Prisma client for DB types, Model for GQL.
  // If Reward is not in GamificationModel, we need it.
  Badge,
  LeaderboardEntry,
  StreakInfo,
  LeaderboardTypeEnum as LeaderboardType,
  // RewardType,
  // RedemptionStatus, // Imported from Model which re-exports from Prisma
} from './models/gamification.model';
import { Reward, RedemptionStatus } from '@prisma/client';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      // Initialize if not exists? Or return null (but GQL says !)
      // Let's safe-guard return default
      return { userId, exp: 0, level: 1, coins: 0, expToNextLevel: 100 };
    }
    return {
      userId,
      exp: profile.exp,
      level: profile.level,
      coins: profile.coins,
      expToNextLevel: profile.nextLevelExp - profile.currentLevelExp,
    };
  }

  async getBadges(): Promise<Badge[]> {
    return this.prisma.badge.findMany();
  }

  async getRewards(): Promise<Reward[]> {
    const rewards = await this.prisma.reward.findMany({
      where: { isActive: true },
    });
    return rewards;
  }

  async getStreaks(userId: string): Promise<StreakInfo> {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) {
      return { currentStreak: 0, longestStreak: 0 };
    }
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActiveDate: streak.lastActive,
    };
  }

  // SSoT: ../../../docs/spec/modules/gamification.md #Update-Leaderboard
  async getLeaderboard(
    type: LeaderboardType,
    limit: number = 10,
  ): Promise<LeaderboardEntry[]> {
    // TODO: Implement Redis sorted sets logic as per spec.
    // Fallback: DB aggregation (simplified)

    const profiles = await this.prisma.userProfile.findMany({
      orderBy: { exp: 'desc' },
      take: limit,
      include: { user: true },
    });

    return profiles.map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      username: p.user.name,
      score: p.exp,
      avatarUrl: undefined, // User model doesn't have avatar yet
    }));
  }

  // SSoT: ../../../docs/spec/modules/gamification.md #Reward-Redemption
  async redeemReward(
    userId: string,
    rewardId: string,
  ): Promise<RewardRedemption> {
    const result = await this.prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({ where: { id: rewardId } });
      if (!reward || !reward.isActive)
        throw new BadRequestException('Reward not valid');

      const profile = await tx.userProfile.findUnique({ where: { userId } });
      if (!profile || profile.coins < reward.cost) {
        throw new BadRequestException('Insufficient coins');
      }

      // Deduct coins
      await tx.userProfile.update({
        where: { userId },
        data: { coins: { decrement: reward.cost } },
      });

      // Create Redemption
      return tx.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          status: RedemptionStatus.FULFILLED, // or PENDING if type is PHYSICAL
          redeemedAt: new Date(),
        },
      });
    });
    return result;
  }

  @OnEvent('lesson.completed')
  async handleLessonCompleted(payload: { userId: string; lessonId: string }) {
    const { userId } = payload;
    // Award fixed EXP for now (e.g. 50 EXP per lesson)
    // In real app, might fetch Lesson to see specific EXP reward
    await this.processExpGain(userId, 50);
  }

  // SSoT: ../../../docs/spec/modules/gamification.md #Process-EXP
  private async processExpGain(userId: string, amount: number) {
    const profile = await this.getUserProfile(userId);

    // Calculate new values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, level, coins, expToNextLevel } = profile;
    // We need raw values from DB or recalculate.
    // getUserProfile returns a constructed object, not the DB record exactly.
    // Let's fetch DB record directly to be safe for updates.

    const dbProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!dbProfile) {
      // Create if not exists (should be created on register, but safe-guard)
      await this.prisma.userProfile.create({
        data: { userId, exp: amount, coins: 10 }, // Bonus coins
      });
      return;
    }

    const newExp = dbProfile.exp + amount;
    let newLevel = dbProfile.level;
    const newCoins = dbProfile.coins + 10; // 10 coins per lesson fixed for now

    // Simple Level formula: Level * 100 EXP needed for next level?
    // Spec: "threshold configurable".
    // Implementation: let's use currentLevelExp and nextLevelExp from DB model or simplify?
    // DB model has `currentLevelExp` and `nextLevelExp`.
    // Let's stick to the DB model fields to update them correctly.

    let currentLevelExp = dbProfile.currentLevelExp + amount;
    let nextLevelExp = dbProfile.nextLevelExp;

    let leveledUp = false;
    while (currentLevelExp >= nextLevelExp) {
      currentLevelExp -= nextLevelExp;
      newLevel++;
      nextLevelExp = Math.floor(nextLevelExp * 1.2); // Increase requirement by 20%
      leveledUp = true;
    }

    await this.prisma.userProfile.update({
      where: { userId },
      data: {
        exp: newExp,
        level: newLevel,
        coins: newCoins,
        currentLevelExp,
        nextLevelExp,
      },
    });

    if (leveledUp) {
      this.eventEmitter.emit('level.up', { userId, newLevel });
    }
  }
}
