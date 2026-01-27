import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Topic } from './topic.model';

@ObjectType()
export class Subject {
  @Field(() => ID)
  id: string;

  @Field()
  tenantId: string;

  @Field()
  name: string;

  @Field(() => Int)
  grade: number;

  @Field()
  curriculum: string;

  @Field(() => Int)
  order: number;

  @Field()
  createdAt: Date;

  @Field(() => [Topic], { nullable: true })
  topics?: Topic[];
}
