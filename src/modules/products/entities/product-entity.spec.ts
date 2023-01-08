import { Product } from "./product-entity";

describe("Product", () => {
  it("should be able to create a new product", () => {
    const product = Product.newProduct({
      category: "BOOKS",
      name: "EBook",
      price: 12.25,
      userId: "example-user-id",
      description: "This is the description",
    });

    expect(product).toBeTruthy();
  });
});
