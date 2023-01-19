import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { parseNullableVariable } from "@shared/utils/parse-nullable-variable";

import { IFindManyOptions } from "@modules/products/dtos/find-many-options";
import { Product } from "@modules/products/entities/product-entity";
import { IProductsRepository } from "@modules/products/repositories/interfaces/products-repository";

import { PrismaProductMapper } from "../mappers/prisma-product-mapper";

export class PrismaProductsRepository implements IProductsRepository {
  public async create(product: Product): Promise<Product> {
    const raw = PrismaProductMapper.toPrisma(product);

    const productCreated = await prisma.product.create({
      data: raw,
    });

    return PrismaProductMapper.toDomain(productCreated);
  }

  public async save(product: Product): Promise<Product> {
    const raw = PrismaProductMapper.toPrisma(product);

    const productUpdated = await prisma.product.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaProductMapper.toDomain(productUpdated);
  }

  public async findById(
    productId: string,
    deleted = false,
  ): Promise<Product | null> {
    const deletedAt = {
      equals: null,
      not: undefined,
    };

    if (deleted) {
      deletedAt.equals = undefined;
      deletedAt.not = {
        equals: null,
      };
    }

    const product = await prisma.product.findFirst({
      where: {
        AND: [
          {
            id: productId,
            deletedAt,
          },
        ],
      },
    });

    if (product === null) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  public async findMany(options: IFindManyOptions): Promise<Product[]> {
    const categoryEquals = parseNullableVariable(options.categoryEquals);
    const nameContains = parseNullableVariable(options.nameContains);
    const priceGte = parseNullableVariable(options.priceGte);
    const priceLte = parseNullableVariable(options.priceLte);
    const userIdEquals = parseNullableVariable(options.userIdEquals);

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            category: {
              equals: categoryEquals,
            },
            name: {
              contains: nameContains,
            },
            price: {
              lte: priceLte,
              gte: priceGte,
            },
            userId: {
              equals: userIdEquals,
            },
            deletedAt: {
              equals: null,
            },
          },
        ],
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }
}
