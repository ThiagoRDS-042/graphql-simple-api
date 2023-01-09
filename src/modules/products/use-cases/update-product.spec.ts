import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "../repositories/factories/products-factory";
import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products-repository";
import { UpdateProduct } from "./update-product";

describe("Update product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let updateProduct: UpdateProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    updateProduct = new UpdateProduct(inMemoryProductsRepository);
    done();
  });
  it("should be able to update a product", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    const { product } = await updateProduct.execute({
      category: "ELECTRONICS",
      name: "sandwich maker",
      price: 150.99,
      productId,
      userId,
      description: "This is the description",
    });

    expect(product.category).toEqual("ELECTRONICS");
    expect(product.name).toEqual("sandwich maker");
    expect(product.price).toEqual(150.99);
    expect(product.description).toEqual("This is the description");
    expect(inMemoryProductsRepository.products).toEqual([product]);
  });

  it("should be able to update a non existing product", async () => {
    await expect(
      updateProduct.execute({
        category: "BOOKS",
        name: "EBook",
        price: 12.25,
        productId: "non-existing-product",
        userId: "example-user-id",
        description: "This is the description",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a product that you don't own", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await expect(
      updateProduct.execute({
        category: "BOOKS",
        name: "EBook",
        price: 12.25,
        productId,
        userId: "user-is-not-the-owner",
        description: "This is the description",
      }),
    ).rejects.toThrow(AppError);
  });
});
