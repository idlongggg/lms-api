import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { AuthPayload, LoginInput, RegisterInput } from './dto/auth.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return this.authService.findAll({});
  }

  @Query(() => User, { name: 'user', nullable: true })
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
  async linkParent(
      @Args('studentEmail') studentEmail: string,
      @Args('parentId', { type: () => ID }) parentId: string // Temporary explicit ID
  ) {
      return this.authService.linkParent(parentId, studentEmail); 
  }
}
