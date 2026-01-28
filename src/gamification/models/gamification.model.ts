import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { RewardType, RedemptionStatus } from '@prisma/client'; // Import from Prisma

// Register Prisma Enums
registerEnumType(RewardType, { name: 'RewardType' });
registerEnumType(RedemptionStatus, { name: 'RedemptionStatus' });
// LeaderboardType is likely NOT in Prisma (it's a view logic often), let's check schema.prisma first.
// Checking schema.prisma from memory (step 82): There is NO LeaderboardType enum in Prisma.
// So LeaderboardType must remain local.
// But RewardType and RedemptionStatus ARE in Prisma.

export { RewardType, RedemptionStatus };

export enum LeaderboardTypeEnum {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ALL_TIME = 'ALL_TIME',
}

registerEnumType(LeaderboardTypeEnum, { name: 'LeaderboardType' });

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  userId: string;

  @Field(() => Int)
  exp: number;

  @Field(() => Int)
  level: number;

  @Field(() => Int)
  coins: number;

  @Field(() => Int)
  expToNextLevel: number;
}

@ObjectType()
export class Badge {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  description: string;

  @Field()
  iconUrl: string;

  @Field(() => GraphQLJSON)
  criteria: any;
}

@ObjectType()
export class Reward {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  cost: number;

  @Field(() => RewardType)
  type: RewardType;
}

@ObjectType()
export class RewardRedemption {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  rewardId: string;

  @Field(() => RedemptionStatus)
  status: RedemptionStatus;

  @Field()
  redeemedAt: Date;
}

@ObjectType()
export class LeaderboardEntry {
  @Field(() => Int)
  rank: number;

  @Field(() => ID)
  userId: string;

  @Field()
  username: string;

  @Field(() => Int)
  score: number;

  @Field({ nullable: true })
  avatarUrl?: string | null;
}

@ObjectType()
export class StreakInfo {
  @Field(() => Int)
  currentStreak: number;

  @Field(() => Int)
  longestStreak: number;

  @Field({ nullable: true })
  lastActiveDate?: Date | null;
}
