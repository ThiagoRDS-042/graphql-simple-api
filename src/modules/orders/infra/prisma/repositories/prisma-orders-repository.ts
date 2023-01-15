import { prisma } from "@shared/infra/database/prisma/prisma-client";

import { IFindManyOptions } from "@modules/orders/dtos/find-many-options";
import { Order } from "@modules/orders/entities/order-entity";
import { IOrdersRepository } from "@modules/orders/repositories/interfaces/orders-repository";

import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";

export class PrismaOrdersRepository implements IOrdersRepository {
  async create(order: Order): Promise<Order> {
    const raw = PrismaOrderMapper.toPrisma(order);

    const orderCreated = await prisma.order.create({
      data: raw,
    });

    return PrismaOrderMapper.toDomain(orderCreated);
  }

  async save(order: Order): Promise<Order> {
    const raw = PrismaOrderMapper.toPrisma(order);

    const orderCreated = await prisma.order.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    return PrismaOrderMapper.toDomain(orderCreated);
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async findMany(options: IFindManyOptions): Promise<Order[]> {
    const { customerIdEquals, isCanceled, productIdEquals, sellerIdEquals } =
      options;

    let canceledAt = undefined;

    if (isCanceled !== undefined && isCanceled) {
      canceledAt = {
        not: {
          equals: null,
        },
      };
    } else if (isCanceled !== undefined && !isCanceled) {
      canceledAt = {
        equals: null,
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          {
            customerId: {
              equals: customerIdEquals,
            },
            productId: {
              equals: productIdEquals,
            },
            sellerId: {
              equals: sellerIdEquals,
            },
            canceledAt,
          },
        ],
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }
}
