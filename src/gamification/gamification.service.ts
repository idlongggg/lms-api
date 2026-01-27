import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserProfile,
  RewardRedemption,
  RedemptionStatus,
} from './models/gamification.model';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const exp = await this.prisma.userExp.findUnique({ where: { userId } });
    if (!exp) {
      return { userId, exp: 0, level: 1, coins: 0 };
    }
    return {
      userId,
      exp: exp.totalExp,
      level: exp.level,
      coins: 0, // Coins not on UserExp in schema... assuming it might be on User or UserProfile.
      // Checking schema.prisma... UserExp has userId, totalExp, level.. NO COINS.
      // Spec says "coins". Schema missing coins.
      // Adding TODO and returning 0 for now.
    };
  }

  async redeemReward(
    userId: string,
    rewardId: string,
  ): Promise<RewardRedemption> {
    // Mock implementation as Reward and Coins schemas are incomplete
    return {
      id: 'mock_redemption_id',
      userId,
      rewardId,
      status: RedemptionStatus.FULFILLED,
      redeemedAt: new Date(),
    };
  }
}
