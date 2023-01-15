import { IFindManyOptions } from "@modules/orders/dtos/find-many-options";
import { Order } from "@modules/orders/entities/order-entity";

import { IOrdersRepository } from "../interfaces/orders-repository";

export class InMemoryOrdersRepository implements IOrdersRepository {
  public orders: Order[] = [];

  async create(order: Order): Promise<Order> {
    this.orders.push(order);

    return order;
  }

  async save(order: Order): Promise<Order> {
    const orderIndex = this.orders.findIndex(item => item.id === order.id);

    if (orderIndex >= 0) {
      this.orders[orderIndex] = order;
    }

    return order;
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.orders.find(item => item.id === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async findMany(options: IFindManyOptions): Promise<Order[]> {
    const { customerIdEquals, isCanceled, productIdEquals, sellerIdEquals } =
      options;

    let { orders } = this;

    if (customerIdEquals && orders.length > 0) {
      orders = orders.filter(item => item.customerId === customerIdEquals);
    }

    if (productIdEquals && orders.length > 0) {
      orders = orders.filter(item => item.productId === productIdEquals);
    }

    if (sellerIdEquals && orders.length > 0) {
      orders = orders.filter(item => item.sellerId === sellerIdEquals);
    }

    if (isCanceled !== undefined && isCanceled && orders.length > 0) {
      orders = orders.filter(item => item.canceledAt);
    } else if (isCanceled !== undefined && !isCanceled && orders.length > 0) {
      orders = orders.filter(item => !item.canceledAt);
    }

    return orders;
  }
}
