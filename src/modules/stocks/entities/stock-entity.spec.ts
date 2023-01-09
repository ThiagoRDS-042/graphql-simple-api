import { Stock } from "./stock-entity";

describe("Stock", () => {
  it("should be able to create a new stock", () => {
    const stock = Stock.newStock({
      amount: 5,
      productId: "example-product-id",
    });

    expect(stock).toBeTruthy();
  });
});
