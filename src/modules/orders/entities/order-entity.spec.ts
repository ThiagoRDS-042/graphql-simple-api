import { Order } from "./order-entity";

describe("Order", () => {
  it("should be able to create a new order", () => {
    const order = Order.newOrder({
      amount: 2,
      customerId: "example-customer-id",
      price: 10,
      productId: "example-product-id",
      sellerId: "example-seller-id",
    });

    expect(order).toBeTruthy();
  });
});
