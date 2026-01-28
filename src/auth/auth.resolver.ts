import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { AuthPayload, LoginInput, RegisterInput } from './dto/auth.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/permissions.decorator';
import { Permission } from './rbac.config';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserSession } from './models/user-session.model';

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
  // SSoT: ../../../docs/spec/modules/auth.md #User-Registration
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  // SSoT: ../../../docs/spec/modules/auth.md #Multi-Device-Login
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.USER_UPDATE)
  // SSoT: ../../../docs/spec/modules/auth.md #Parent-Student-Link
  async linkParent(
    @Args('studentEmail') studentEmail: string,
    @Args('parentId', { type: () => ID }) parentId: string, // Temporary explicit ID
  ) {
    return this.authService.linkParent(parentId, studentEmail);
  }

  @Mutation(() => AuthPayload)
  @UseGuards(GqlAuthGuard)
  // Spec says @auth which implies valid token.
  async refreshToken(@CurrentUser() user: User, @Args('token') token: string) {
    // SSoT: ../../../docs/spec/modules/auth.md #Token-Refresh
    return this.authService.refreshToken(token);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/auth.md #Logout-&-Revoke
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  // SSoT: ../../../docs/spec/modules/auth.md #Logout-&-Revoke
  async revokeSession(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.authService.revokeSession(id, user.id);
  }

  @Query(() => [UserSession], { name: 'sessions' })
  @UseGuards(GqlAuthGuard)
  async getSessions(@CurrentUser() user: User) {
    return this.authService.getSessions(user.id);
  }
}
