import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Product } from "../entities/product-entity";
import { IProductsRepository } from "../repositories/products-repository";

interface IShowProductParams {
  productId: string;
}

interface IShowProductResponse {
  product: Product;
}

@injectable()
export class ShowProduct {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(
    data: IShowProductParams,
  ): Promise<IShowProductResponse> {
    const { productId } = data;

    const product = await this.productsRepository.findById(productId);

    if (product === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    return { product };
  }
}
