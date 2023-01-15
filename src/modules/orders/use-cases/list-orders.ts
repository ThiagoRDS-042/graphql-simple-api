import { inject, injectable } from "tsyringe";

import { Order } from "../entities/order-entity";
import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

interface IListOrdersParams {
  productIdEquals?: string;
  customerIdEquals?: string;
  sellerIdEquals?: string;
  isCanceled?: boolean;
}

interface IListOrdersResponse {
  orders: Order[];
}

@injectable()
export class ListOrders {
  constructor(
    @inject("OrdersRepository")
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(data: IListOrdersParams): Promise<IListOrdersResponse> {
    const { customerIdEquals, productIdEquals, sellerIdEquals, isCanceled } =
      data;

    const orders = await this.ordersRepository.findMany({
      customerIdEquals,
      productIdEquals,
      sellerIdEquals,
      isCanceled,
    });

    return { orders };
  }
}
