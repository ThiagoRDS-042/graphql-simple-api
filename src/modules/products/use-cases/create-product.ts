import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

import { CategoryType, Product } from "../entities/product-entity";
import { IProductsRepository } from "../repositories/interfaces/products-repository";

interface ICreateProductParams {
  name: string;
  price: number;
  description?: string;
  userId: string;
  category: CategoryType;
}

interface ICreateProductResponse {
  product: Product;
}

@injectable()
export class CreateProduct {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,

    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(
    data: ICreateProductParams,
  ): Promise<ICreateProductResponse> {
    const { category, description, name, price, userId } = data;

    const userExist = await this.usersRepository.findById(userId);

    if (userExist === null) {
      throw new AppError("User does not exist", "USER_NOT_FOUND", 404);
    }

    let product = Product.newProduct({
      category,
      description,
      name,
      price,
      userId,
    });

    product = await this.productsRepository.create(product);

    return { product };
  }
}
