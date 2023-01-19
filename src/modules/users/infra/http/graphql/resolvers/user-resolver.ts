import { container } from "tsyringe";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { IContext } from "@shared/infra/http/graphql/context";
import {
  CurrentUser,
  ICurrentUser,
} from "@shared/infra/http/graphql/decorators/current-user";
import { ensureAuthenticated } from "@shared/infra/http/graphql/middlewares/ensureAuthenticated";
import { ensureHasRole } from "@shared/infra/http/graphql/middlewares/ensureHasRole";

import { CookieConfig } from "@config/cookie-config";
import { OrderModel } from "@modules/orders/infra/http/graphql/models/order-model";
import {
  IOrderViewModelResponse,
  OrderViewModel,
} from "@modules/orders/infra/http/view-models/order-view-model";
import { ProductModel } from "@modules/products/infra/http/graphql/models/product-model";
import {
  IProductViewModelResponse,
  ProductViewModel,
} from "@modules/products/infra/http/view-models/product-view-model";
import {
  ActiveUser,
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
import {
  ActiveUserInput,
  CreateUserInput,
  ListUsersInput,
  UpdateUserInput,
} from "../inputs";
import { UserRoleInput } from "../inputs/create-user-input";
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

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["ADMIN"]))
  @Mutation(() => Boolean)
  async activeUser(
    @Arg("activeUserInput") input: ActiveUserInput,
  ): Promise<boolean> {
    const { email } = input;

    const activeUser = container.resolve(ActiveUser);

    await activeUser.execute({
      email,
    });

    return true;
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["ADMIN"]))
  @Query(() => [UserModel])
  async listUsers(
    @Arg("listUsersInput", { nullable: true }) input: ListUsersInput,
  ): Promise<IUserViewModelResponse[]> {
    let emailContains: string = undefined;
    let nameContains: string = undefined;
    let roleEquals: UserRoleInput = undefined;

    if (input) {
      emailContains = input.emailContains;
      nameContains = input.nameContains;
      roleEquals = input.roleEquals;
    }

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

  @FieldResolver(() => ProductModel)
  async products(
    @Root() userModel: UserModel,
    @Ctx() context: IContext,
  ): Promise<IProductViewModelResponse[]> {
    const { productDataSource } = context.dataSources;

    const { id } = userModel;

    const products = await productDataSource.listByUserId(id);

    return products.map(ProductViewModel.toHTTP);
  }

  @FieldResolver(() => [OrderModel])
  async orders(
    @Root() userModel: UserModel,
    @Ctx() context: IContext,
  ): Promise<IOrderViewModelResponse[]> {
    const { orderDataSource } = context.dataSources;

    const { id } = userModel;

    const orders = await orderDataSource.listByUserId(id);

    return orders.map(OrderViewModel.toHTTP);
  }
}
