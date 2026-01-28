import {
  InputType,
  Field,
  ObjectType,
  ID,
  registerEnumType,
} from '@nestjs/graphql';

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

registerEnumType(JobStatus, { name: 'JobStatus' });

@InputType()
export class CreateTenantInput {
  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  adminEmail: string;
}

@InputType()
export class UpdateTenantInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  domain?: string;

  // Status update usually via separate mutation but spec implies generic update
  @Field({ nullable: true })
  settings?: string; // JSON string? Or use GraphQLJSON in Service
}

@ObjectType()
export class ImportJob {
  @Field(() => ID)
  jobId: string;

  @Field(() => JobStatus)
  status: JobStatus;
}
