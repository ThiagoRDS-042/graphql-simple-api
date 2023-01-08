import {
  CategoryType,
  Product,
} from "@modules/products/entities/product-entity";

export interface IProductViewModelResponse {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  userId: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ProductViewModel {
  static toHTTP(product: Product): IProductViewModelResponse {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      userId: product.userId,
      description: product.description,
      createdAt: product.createdAt,
      deletedAt: product.deletedAt,
      updatedAt: product.updatedAt,
    };
  }
}
