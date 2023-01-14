import DataLoader from "dataloader";

import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { BaseDataSource } from "@shared/utils/base-data-source";

import { Product } from "@modules/products/entities/product-entity";
import { PrismaProductMapper } from "@modules/products/infra/prisma/mappers/prisma-product-mapper";
import { PrismaClient } from "@prisma/client";

export class ProductDataSource extends BaseDataSource {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = prisma;
  }

  async listByUserId(userId: string): Promise<Product[]> {
    return this.listByUserIdLoader.load(userId);
  }

  async getById(productId: string): Promise<Product> {
    return this.getByIdLoader.load(productId);
  }

  private listByUserIdLoader = new DataLoader(async (userIds: string[]) => {
    const products = await this.prisma.product.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return userIds.map(userId =>
      products
        .filter(product => product.userId === userId)
        .map(PrismaProductMapper.toDomain),
    );
  });

  private getByIdLoader = new DataLoader(async (productIds: string[]) => {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return productIds.map(productId =>
      PrismaProductMapper.toDomain(
        products.find(product => product.id === productId),
      ),
    );
  });
}
