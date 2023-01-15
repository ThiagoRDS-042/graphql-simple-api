import { IOrderProps, Order } from "@modules/orders/entities/order-entity";

type Override = Partial<IOrderProps>;

export const makeOrder = (override: Override = {}): Order => {
  return Order.newOrder({
    amount: 1,
    customerId: "example-customer-id",
    price: 5,
    productId: "example-product-id",
    sellerId: "example-example-seller-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    canceledAt: null,
    ...override,
  });
};
