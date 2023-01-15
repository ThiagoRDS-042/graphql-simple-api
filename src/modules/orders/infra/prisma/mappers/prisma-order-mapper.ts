import { Order } from "@modules/orders/entities/order-entity";

interface IRawOrder {
  id: string;
  amount: number;
  price: number;
  productId: string;
  customerId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
}

export class PrismaOrderMapper {
  public static toPrisma(order: Order): IRawOrder {
    return {
      id: order.id,
      amount: order.amount,
      price: order.price,
      productId: order.productId,
      customerId: order.customerId,
      sellerId: order.sellerId,
      createdAt: order.createdAt,
      canceledAt: order.canceledAt,
      updatedAt: order.updatedAt,
    };
  }

  public static toDomain(raw: IRawOrder): Order {
    return Order.newOrder(
      {
        amount: raw.amount,
        customerId: raw.customerId,
        price: raw.price,
        productId: raw.productId,
        sellerId: raw.sellerId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        canceledAt: raw.canceledAt,
      },
      raw.id,
    );
  }
}
