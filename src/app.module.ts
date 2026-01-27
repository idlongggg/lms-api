import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LearningModule } from './learning/learning.module';
import { TenantModule } from './tenant/tenant.module';
import { MediaModule } from './media/media.module';
import { WebhookModule } from './webhook/webhook.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamificationModule } from './gamification/gamification.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      playground: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    AdminModule,
    LearningModule,
    TenantModule,
    MediaModule,
    WebhookModule,
    HealthModule,
    GamificationModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
