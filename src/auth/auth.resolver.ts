import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { AuthPayload, LoginInput, RegisterInput } from './dto/auth.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/permissions.decorator';
import { Permission } from './rbac.config';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.USER_READ)
  async getUsers() {
    return this.authService.findAll({});
  }

  @Query(() => User, { name: 'user', nullable: true })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.USER_READ)
  async getUser(@Args('id', { type: () => String }) id: string) {
    return this.authService.findOne({ id });
  }

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.USER_UPDATE)
  async linkParent(
    @Args('studentEmail') studentEmail: string,
    @Args('parentId', { type: () => ID }) parentId: string, // Temporary explicit ID
  ) {
    return this.authService.linkParent(parentId, studentEmail);
  }
}
