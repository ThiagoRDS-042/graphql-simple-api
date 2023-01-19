import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";
import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

import { IProductsRepository } from "../repositories/interfaces/products-repository";

interface IActiveProductParams {
  productId: string;
  userId: string;
}

@injectable()
export class ActiveProduct {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,

    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,
  ) {}

  public async execute(data: IActiveProductParams): Promise<void> {
    const { productId, userId } = data;

    const product = await this.productsRepository.findById(productId, true);

    if (product === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError("User does not exist", "USER_NOT_FOUND", 404);
    }

    if (user && user.id !== product.userId) {
      throw new AppError(
        "User does not is owner of the product",
        "USER_NOT_IS_OWNER",
        403,
      );
    }

    product.active();

    await this.productsRepository.save(product);

    const stock = await this.stocksRepository.findByProductId(productId, true);
    if (stock) {
      stock.active();

      await this.stocksRepository.save(stock);
    }
  }
}
