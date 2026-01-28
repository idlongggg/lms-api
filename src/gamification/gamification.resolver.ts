import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { GamificationService } from './gamification.service';
import {
  UserProfile,
  RewardRedemption,
  Badge,
  Reward,
  LeaderboardEntry,
  StreakInfo,
  LeaderboardTypeEnum as LeaderboardType,
} from './models/gamification.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver()
export class GamificationResolver {
  constructor(private readonly gamificationService: GamificationService) {}

  @Query(() => UserProfile, { name: 'userProfile' })
  @UseGuards(GqlAuthGuard)
  async getUserProfile(@CurrentUser() user: User) {
    return this.gamificationService.getUserProfile(user.id);
  }

  @Query(() => [Badge], { name: 'badges' })
  @UseGuards(GqlAuthGuard)
  async getBadges() {
    return this.gamificationService.getBadges();
  }

  @Query(() => [Reward], { name: 'rewards' })
  @UseGuards(GqlAuthGuard)
  async getRewards() {
    return this.gamificationService.getRewards();
  }

  @Query(() => StreakInfo, { name: 'streaks' })
  @UseGuards(GqlAuthGuard)
  async getStreaks(@CurrentUser() user: User) {
    return this.gamificationService.getStreaks(user.id);
  }

  @Query(() => [LeaderboardEntry], { name: 'leaderboard' })
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/gamification.md #Update-Leaderboard
  async getLeaderboard(
    @Args('type', { type: () => LeaderboardType }) type: LeaderboardType,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.gamificationService.getLeaderboard(type, limit);
  }

  @Mutation(() => RewardRedemption)
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/gamification.md #Reward-Redemption
  async redeemReward(
    @CurrentUser() user: User,
    @Args('rewardId', { type: () => ID }) rewardId: string,
  ) {
    return this.gamificationService.redeemReward(user.id, rewardId);
  }
}
