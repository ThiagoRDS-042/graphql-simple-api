import { IFindManyOptions } from "@modules/orders/dtos/find-many-options";
import { Order } from "@modules/orders/entities/order-entity";

export interface IOrdersRepository {
  create(order: Order): Promise<Order>;
  save(order: Order): Promise<Order>;
  findById(orderId: string): Promise<Order | null>;
  findMany(options: IFindManyOptions): Promise<Order[]>;
}
