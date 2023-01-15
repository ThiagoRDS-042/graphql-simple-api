import { container } from "tsyringe";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import {
  CurrentUser,
  ICurrentUser,
} from "@shared/infra/http/graphql/decorators/current-user";
import { ensureAuthenticated } from "@shared/infra/http/graphql/middlewares/ensureAuthenticated";
import { ensureHasRole } from "@shared/infra/http/graphql/middlewares/ensureHasRole";

import {
  CreateOrder,
  UpdateOrder,
  ListOrders,
  ShowOrder,
  CancelOrder,
} from "@modules/orders/use-cases";

import {
  IOrderViewModelResponse,
  OrderViewModel,
} from "../../view-models/order-view-model";
import {
  CreateOrderInput,
  ListOrdersInput,
  ListOrdersToCustomerInput,
  ListOrdersToSellerInput,
  UpdateOrderInput,
} from "../inputs/";
import { OrderModel } from "../models/order-model";

@Resolver(() => OrderModel)
export class OrderResolver {
  @UseMiddleware(ensureAuthenticated, ensureHasRole(["CUSTOMER"]))
  @Mutation(() => OrderModel)
  async createOrder(
    @Arg("createOrderInput") input: CreateOrderInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IOrderViewModelResponse> {
    const { amount, productId } = input;
    const { userId: customerId } = currentUser;

    const createOrder = container.resolve(CreateOrder);

    const { order } = await createOrder.execute({
      amount,
      productId,
      customerId,
    });

    return OrderViewModel.toHTTP(order);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["CUSTOMER"]))
  @Mutation(() => OrderModel)
  async updateOrder(
    @Arg("updateOrderInput") input: UpdateOrderInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IOrderViewModelResponse> {
    const { amount, productId, orderId } = input;
    const { userId: customerId } = currentUser;

    const updateOrder = container.resolve(UpdateOrder);

    const { order } = await updateOrder.execute({
      amount,
      productId,
      customerId,
      orderId,
    });

    return OrderViewModel.toHTTP(order);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["CUSTOMER"]))
  @Query(() => [Boolean])
  async cancelOrder(
    @Arg("orderId")
    orderId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    const { userId: customerId } = currentUser;

    const cancelOrder = container.resolve(CancelOrder);

    await cancelOrder.execute({
      customerId,
      orderId,
    });

    return true;
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["ADMIN"]))
  @Query(() => [OrderModel])
  async listOrders(
    @Arg("listOrdersInput", { nullable: true }) input: ListOrdersInput,
  ): Promise<IOrderViewModelResponse[]> {
    let customerIdEquals: string = undefined;
    let productIdEquals: string = undefined;
    let isCanceled: boolean = undefined;
    let sellerIdEquals: string = undefined;

    if (input) {
      customerIdEquals = input.customerIdEquals;
      productIdEquals = input.productIdEquals;
      isCanceled = input.isCanceled;
      sellerIdEquals = input.sellerIdEquals;
    }

    const listOrders = container.resolve(ListOrders);

    const { orders } = await listOrders.execute({
      customerIdEquals,
      isCanceled,
      productIdEquals,
      sellerIdEquals,
    });

    return orders.map(OrderViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Query(() => [OrderModel])
  async listOrdersToSeller(
    @Arg("listOrdersToSellerInput", { nullable: true })
    input: ListOrdersToSellerInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IOrderViewModelResponse[]> {
    let customerIdEquals: string = undefined;
    let productIdEquals: string = undefined;
    let isCanceled: boolean = undefined;

    if (input) {
      customerIdEquals = input.customerIdEquals;
      productIdEquals = input.productIdEquals;
      isCanceled = input.isCanceled;
    }

    const { userId } = currentUser;

    const listOrders = container.resolve(ListOrders);

    const { orders } = await listOrders.execute({
      customerIdEquals,
      isCanceled,
      productIdEquals,
      sellerIdEquals: userId,
    });

    return orders.map(OrderViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["CUSTOMER"]))
  @Query(() => [OrderModel])
  async listOrdersToCustomer(
    @Arg("listOrdersToCustomerInput", { nullable: true })
    input: ListOrdersToCustomerInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IOrderViewModelResponse[]> {
    let productIdEquals: string = undefined;
    let isCanceled: boolean = undefined;
    let sellerIdEquals: string = undefined;

    if (input) {
      productIdEquals = input.productIdEquals;
      isCanceled = input.isCanceled;
      sellerIdEquals = input.sellerIdEquals;
    }

    const { userId } = currentUser;

    const listOrders = container.resolve(ListOrders);

    const { orders } = await listOrders.execute({
      customerIdEquals: userId,
      isCanceled,
      productIdEquals,
      sellerIdEquals,
    });

    return orders.map(OrderViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated)
  @Query(() => OrderModel)
  async showOrder(
    @Arg("orderId") orderId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IOrderViewModelResponse> {
    const showOrder = container.resolve(ShowOrder);

    const { order } = await showOrder.execute({
      orderId,
      currentUser,
    });

    return OrderViewModel.toHTTP(order);
  }
}
