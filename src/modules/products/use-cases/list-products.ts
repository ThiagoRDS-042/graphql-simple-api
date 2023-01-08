import { inject, injectable } from "tsyringe";

import { CategoryType, Product } from "../entities/product-entity";
import { IProductsRepository } from "../repositories/products-repository";

interface IListProductsParams {
  nameContains?: string;
  categoryEquals?: CategoryType;
  userIdEquals?: string;
  priceLte?: number;
  priceGte?: number;
}

interface IListProductsResponse {
  products: Product[];
}

@injectable()
export class ListProducts {
  constructor(
    @inject("ProductsRepository")
    private readonly productsRepository: IProductsRepository,
  ) {}

  public async execute(
    data: IListProductsParams,
  ): Promise<IListProductsResponse> {
    const { categoryEquals, nameContains, priceGte, priceLte, userIdEquals } =
      data;

    const products = await this.productsRepository.findMany({
      categoryEquals,
      nameContains,
      priceGte,
      priceLte,
      userIdEquals,
    });

    return { products };
  }
}
