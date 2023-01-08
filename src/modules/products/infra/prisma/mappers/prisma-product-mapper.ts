import {
  CategoryType,
  Product,
} from "@modules/products/entities/product-entity";

interface IRawProduct {
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

export class PrismaProductMapper {
  public static toPrisma(product: Product): IRawProduct {
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

  public static toDomain(raw: IRawProduct): Product {
    return Product.newProduct(
      {
        category: raw.category,
        price: raw.price,
        userId: raw.userId,
        description: raw.description,
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      raw.id,
    );
  }
}
