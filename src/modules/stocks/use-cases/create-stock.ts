import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IProductsRepository } from "@modules/products/repositories/interfaces/products-repository";

import { Stock } from "../entities/stock-entity";
import { IStocksRepository } from "../repositories/interfaces/stocks-repository";

interface ICreateStockParams {
  amount: number;
  productId: string;
  userId: string;
}

interface ICreateStockResponse {
  stock: Stock;
}

@injectable()
export class CreateStock {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,

    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(
    data: ICreateStockParams,
  ): Promise<ICreateStockResponse> {
    const { amount, productId, userId } = data;

    const productExist = await this.productsRepository.findById(productId);

    if (productExist === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    const stockAlreadyExist = await this.stocksRepository.findByProductId(
      productId,
    );

    if (stockAlreadyExist !== null) {
      throw new AppError(
        "Stock on product already exist",
        "STOCK_ON_PRODUCT_ALREADY_EXIST",
        409,
      );
    }

    if (productExist.userId !== userId) {
      throw new AppError("User does not is owner", "USER_NOT_IS_OWNER", 403);
    }

    let stock = Stock.newStock({
      amount,
      productId,
    });

    stock = await this.stocksRepository.create(stock);

    return { stock };
  }
}
