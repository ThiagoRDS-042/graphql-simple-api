import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";

import { IProductsRepository } from "../repositories/interfaces/products-repository";

interface IDeleteProductParams {
  productId: string;
  userId: string;
}

@injectable()
export class DeleteProduct {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,

    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,
  ) {}

  public async execute(data: IDeleteProductParams): Promise<void> {
    const { productId, userId } = data;

    const product = await this.productsRepository.findById(productId);

    if (product === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    if (product.userId !== userId) {
      throw new AppError(
        "User does not is owner of the product",
        "USER_NOT_IS_OWNER",
        403,
      );
    }

    product.delete();

    await this.productsRepository.save(product);

    const stock = await this.stocksRepository.findByProductId(productId);
    if (stock) {
      stock.delete();

      await this.stocksRepository.save(stock);
    }
  }
}
