import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

interface ICancelOrderParams {
  orderId: string;
  customerId: string;
}

@injectable()
export class CancelOrder {
  constructor(
    @inject("OrdersRepository")
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(data: ICancelOrderParams): Promise<void> {
    const { customerId, orderId } = data;

    const order = await this.ordersRepository.findById(orderId);

    if (order === null) {
      throw new AppError("Order does not exist", "ORDER_NOT_FOUND", 404);
    }

    if (order.canceledAt !== null) {
      throw new AppError(
        "Order already has canceled",
        "ORDER_ALREADY_HAS_CANCELED",
        403,
      );
    }

    if (order.customerId !== customerId) {
      throw new AppError(
        "Customer does not is owner of the order",
        "CUSTOMER_NOT_IS_OWNER",
        403,
      );
    }

    order.cancel();

    await this.ordersRepository.save(order);
  }
}
