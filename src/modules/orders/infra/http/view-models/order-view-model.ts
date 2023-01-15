import { Order } from "@modules/orders/entities/order-entity";

export interface IOrderViewModelResponse {
  id: string;
  amount: number;
  productId: string;
  createdAt: Date;
  canceledAt: Date | null;
  updatedAt: Date;
  price: number;
  sellerId: string;
  customerId: string;
}

export class OrderViewModel {
  static toHTTP(order: Order): IOrderViewModelResponse {
    return {
      id: order.id,
      amount: order.amount,
      productId: order.productId,
      price: order.price,
      sellerId: order.sellerId,
      customerId: order.customerId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      canceledAt: order.canceledAt,
    };
  }
}
