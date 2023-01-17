import DataLoader from "dataloader";

import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { BaseDataSource } from "@shared/utils/base-data-source";

import { Order } from "@modules/orders/entities/order-entity";
import { PrismaOrderMapper } from "@modules/orders/infra/prisma/mappers/prisma-order-mapper";
import { PrismaClient } from "@prisma/client";

export class OrderDataSource extends BaseDataSource {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = prisma;
  }

  async listByUserId(userId: string): Promise<Order[]> {
    return this.listByUserIdLoader.load(userId);
  }

  async listByProductId(productId: string): Promise<Order[]> {
    return this.listByProductIdLoader.load(productId);
  }

  private listByUserIdLoader = new DataLoader(async (userIds: string[]) => {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          {
            sellerId: {
              in: userIds,
            },
          },
          {
            customerId: {
              in: userIds,
            },
          },
        ],
      },
    });

    return userIds.map(userId =>
      orders
        .filter(
          order => order.customerId === userId || order.sellerId === userId,
        )
        .map(PrismaOrderMapper.toDomain),
    );
  });

  private listByProductIdLoader = new DataLoader(
    async (productIds: string[]) => {
      const orders = await this.prisma.order.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
      });

      return productIds.map(productId =>
        orders
          .filter(order => order.productId === productId)
          .map(PrismaOrderMapper.toDomain),
      );
    },
  );
}
