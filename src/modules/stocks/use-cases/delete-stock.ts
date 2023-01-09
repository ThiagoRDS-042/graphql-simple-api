import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IProductsRepository } from "@modules/products/repositories/products-repository";

import { IStocksRepository } from "../repositories/stocks-repository";

interface IDeleteStockParams {
  productId: string;
  userId: string;
}

@injectable()
export class DeleteStock {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,

    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(data: IDeleteStockParams): Promise<void> {
    const { productId, userId } = data;

    const productExist = await this.productsRepository.findById(productId);

    if (productExist === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    const stock = await this.stocksRepository.findByProductId(productId);

    if (stock === null) {
      throw new AppError("Stock does not exist", "STOCK_NOT_FOUND", 404);
    }

    if (productExist.userId !== userId) {
      throw new AppError("Forbidden", "FORBIDDEN", 404);
    }

    stock.delete();

    this.stocksRepository.save(stock);
  }
}
