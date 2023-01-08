import { container } from "tsyringe";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { IContext } from "@shared/infra/http/graphql/context";
import {
  CurrentUser,
  ICurrentUser,
} from "@shared/infra/http/graphql/decorators/current-user";
import { ensureAuthenticated } from "@shared/infra/http/graphql/middleware/ensureAuthenticated";
import { ensureHasRole } from "@shared/infra/http/graphql/middleware/ensureHasRole";

import { CookieConfig } from "@config/cookie-config";
import {
  CreateUser,
  DeleteUser,
  ListUsers,
  ShowUser,
  UpdateUser,
} from "@modules/users/use-cases";

import {
  IUserViewModelResponse,
  UserViewModel,
} from "../../view-models/user-view-model";
import { CreateUserInput, ListUsersInput, UpdateUserInput } from "../inputs";
import { UserModel } from "../models/user-model";

@Resolver(() => UserModel)
export class UserResolver {
  @Mutation(() => UserModel)
  async createUser(
    @Arg("createUserInput") input: CreateUserInput,
  ): Promise<IUserViewModelResponse> {
    const { email, name, password, phone, document, role } = input;

    const createUser = container.resolve(CreateUser);

    const { user } = await createUser.execute({
      name,
      email,
      password,
      phone,
      document,
      role,
    });

    return UserViewModel.toHTTP(user);
  }

  @UseMiddleware(ensureAuthenticated)
  @Mutation(() => UserModel)
  async updateUser(
    @Arg("updateUserInput") input: UpdateUserInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IUserViewModelResponse> {
    const { email, name, password, phone, document } = input;
    const { userId } = currentUser;

    const updateUser = container.resolve(UpdateUser);

    const { user } = await updateUser.execute({
      name,
      email,
      password,
      userId,
      document,
      phone,
    });

    return UserViewModel.toHTTP(user);
  }

  @UseMiddleware(ensureAuthenticated)
  @Mutation(() => Boolean)
  async deleteUser(
    @CurrentUser() currentUser: ICurrentUser,
    @Ctx() context: IContext,
  ): Promise<boolean> {
    const { userId } = currentUser;

    const deleteUser = container.resolve(DeleteUser);

    await deleteUser.execute({ userId });

    const { res } = context;

    const { key } = CookieConfig.newCookieConfig();

    res.clearCookie(key);

    return true;
  }

  @UseMiddleware(ensureAuthenticated)
  @UseMiddleware(ensureHasRole(["ADMIN"]))
  @Query(() => [UserModel])
  async listUsers(
    @Arg("listUsersInput") input: ListUsersInput,
  ): Promise<IUserViewModelResponse[]> {
    const { emailContains, nameContains, roleEquals } = input;

    const listUsers = container.resolve(ListUsers);

    const { users } = await listUsers.execute({
      emailContains,
      nameContains,
      roleEquals,
    });

    return users.map(UserViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated)
  @Query(() => UserModel)
  async showUser(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IUserViewModelResponse> {
    const { userId } = currentUser;

    const showUser = container.resolve(ShowUser);

    const { user } = await showUser.execute({ userId });

    return UserViewModel.toHTTP(user);
  }
}
