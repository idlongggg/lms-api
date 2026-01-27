import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GamificationService } from './gamification.service';
import { UserProfile, RewardRedemption } from './models/gamification.model';

@Resolver()
export class GamificationResolver {
  constructor(private readonly gamificationService: GamificationService) {}

  @Query(() => UserProfile, { name: 'userProfile' })
  async getUserProfile(@Args('userId', { type: () => ID }) userId: string) {
    return this.gamificationService.getUserProfile(userId);
  }

  @Mutation(() => RewardRedemption)
  async redeemReward(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('rewardId', { type: () => ID }) rewardId: string
  ) {
    return this.gamificationService.redeemReward(userId, rewardId);
  }
}
