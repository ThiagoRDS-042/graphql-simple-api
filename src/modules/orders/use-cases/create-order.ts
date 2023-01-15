import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IProductsRepository } from "@modules/products/repositories/interfaces/products-repository";
import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";
import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

import { Order } from "../entities/order-entity";
import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

interface ICreateOrderParams {
  customerId: string;
  productId: string;
  amount: number;
}

interface ICreateOrderResponse {
  order: Order;
}

@injectable()
export class CreateOrder {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,

    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,

    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("OrdersRepository")
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(
    data: ICreateOrderParams,
  ): Promise<ICreateOrderResponse> {
    const { amount, customerId, productId } = data;

    const productExist = await this.productsRepository.findById(productId);

    if (productExist === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    const stockExist = await this.stocksRepository.findByProductId(productId);

    if (stockExist === null) {
      throw new AppError("Stock does not exist", "STOCK_NOT_FOUND", 404);
    }

    if (stockExist.amount < amount) {
      throw new AppError(
        "The quantity of products in stock is insufficient",
        "QUANTITY_OF_PRODUCTS_IN_STOCK_IS_INSUFFICIENT",
        400,
      );
    }

    const customerExist = await this.usersRepository.findById(customerId);

    if (customerExist === null) {
      throw new AppError("Customer does not exist", "CUSTOMER_NOT_FOUND", 404);
    }

    const price = productExist.price * amount;

    let order = Order.newOrder({
      amount,
      productId,
      price,
      customerId,
      sellerId: productExist.userId,
    });

    order = await this.ordersRepository.create(order);

    return { order };
  }
}
