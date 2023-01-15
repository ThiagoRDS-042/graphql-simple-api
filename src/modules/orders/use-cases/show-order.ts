import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Order } from "../entities/order-entity";
import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

interface IShowOrderParams {
  orderId: string;
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
    const { orderId } = data;

    const order = await this.ordersRepository.findById(orderId);

    if (order === null) {
      throw new AppError("Order does not exist", "ORDER_NOT_FOUND", 404);
    }

    return { order };
  }
}
