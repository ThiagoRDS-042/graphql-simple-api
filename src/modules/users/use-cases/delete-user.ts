import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IProductsRepository } from "@modules/products/repositories/interfaces/products-repository";
import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";

import { IUsersRepository } from "../repositories/interfaces/users-repository";

interface IDeleteUserParams {
  userId: string;
}

@injectable()
export class DeleteUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,

    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,
  ) {}

  public async execute(data: IDeleteUserParams): Promise<void> {
    const { userId } = data;

    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError("User does not exist", "USER_NOT_FOUND", 404);
    }

    user.delete();

    await this.usersRepository.save(user);

    if (user.role === "SELLER") {
      const products = await this.productsRepository.findMany({
        userIdEquals: user.id,
      });

      await Promise.all([
        ...products.map(product => {
          product.delete();

          return this.productsRepository.save(product);
        }),
        ...products.map(async product => {
          const stock = await this.stocksRepository.findByProductId(product.id);

          if (stock) {
            stock.delete();

            return this.stocksRepository.save(stock);
          }
        }),
      ]);
    }
  }
}
