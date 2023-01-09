import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IProductsRepository } from "@modules/products/repositories/products-repository";

import { Stock } from "../entities/stock-entity";
import { IStocksRepository } from "../repositories/stocks-repository";

interface IUpdateStockParams {
  amount: number;
  productId: string;
  userId: string;
}

interface IUpdateStockResponse {
  stock: Stock;
}

@injectable()
export class UpdateStock {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,

    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(
    data: IUpdateStockParams,
  ): Promise<IUpdateStockResponse> {
    const { amount, productId, userId } = data;

    const productExist = await this.productsRepository.findById(productId);

    if (productExist === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    const stockExist = await this.stocksRepository.findByProductId(productId);

    if (stockExist === null) {
      throw new AppError("Stock does not exist", "STOCK_NOT_FOUND", 404);
    }

    if (productExist.userId !== userId) {
      throw new AppError("Forbidden", "FORBIDDEN", 404);
    }

    let stock = Stock.newStock(
      {
        amount,
        productId,
      },
      stockExist.id,
    );

    stock = await this.stocksRepository.save(stock);

    return { stock };
  }
}
