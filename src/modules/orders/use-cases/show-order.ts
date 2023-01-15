import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";
import { ICurrentUser } from "@shared/infra/http/graphql/decorators/current-user";

import { Order } from "../entities/order-entity";
import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

interface IShowOrderParams {
  orderId: string;
  currentUser: ICurrentUser;
}

interface IShowOrderResponse {
  order: Order;
}

@injectable()
export class ShowOrder {
  constructor(
    @inject("OrdersRepository")
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(data: IShowOrderParams): Promise<IShowOrderResponse> {
    const { orderId, currentUser } = data;

    const order = await this.ordersRepository.findById(orderId);

    if (order === null) {
      throw new AppError("Order does not exist", "ORDER_NOT_FOUND", 404);
    }

    if (
      currentUser.userRole === "CUSTOMER" &&
      order.customerId !== currentUser.userId
    ) {
      throw new AppError(
        "Customer does not the owner of the order",
        "CUSTOMER_NOT_OWNER",
        403,
      );
    }

    if (
      currentUser.userRole === "SELLER" &&
      order.sellerId !== currentUser.userId
    ) {
      throw new AppError(
        "Seller does not the owner of the order",
        "SELLER_NOT_OWNER",
        403,
      );
    }

    return { order };
  }
}
