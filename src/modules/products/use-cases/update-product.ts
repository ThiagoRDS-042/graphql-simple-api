import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { CategoryType, Product } from "../entities/product-entity";
import { IProductsRepository } from "../repositories/interfaces/products-repository";

interface IUpdateProductParams {
  name: string;
  price: number;
  description: string;
  productId: string;
  userId: string;
  category: CategoryType;
}

interface IUpdateProductResponse {
  product: Product;
}

@injectable()
export class UpdateProduct {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(
    data: IUpdateProductParams,
  ): Promise<IUpdateProductResponse> {
    const { category, description, name, price, productId, userId } = data;

    const productExists = await this.productsRepository.findById(productId);

    if (productExists === null) {
      throw new AppError("Product does not exist", "PRODUCT_NOT_FOUND", 404);
    }

    if (productExists.userId !== userId) {
      throw new AppError(
        "User does not is owner of the product",
        "USER_NOT_IS_OWNER",
        403,
      );
    }

    let product = Product.newProduct(
      {
        category,
        description,
        name,
        price,
        userId,
      },
      productId,
    );

    product = await this.productsRepository.save(product);

    return { product };
  }
}
