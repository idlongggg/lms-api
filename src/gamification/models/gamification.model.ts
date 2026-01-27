import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';

export enum RewardType {
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
}

registerEnumType(RewardType, { name: 'RewardType' });

export enum RedemptionStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
}

registerEnumType(RedemptionStatus, { name: 'RedemptionStatus' });

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
