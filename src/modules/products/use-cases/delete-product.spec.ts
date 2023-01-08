import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@test/factories/products-factory";
import { InMemoryProductsRepository } from "@test/repositories/in-memory-products-repository";

import { DeleteProduct } from "./delete-product";

describe("Delete product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let deleteProduct: DeleteProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    deleteProduct = new DeleteProduct(inMemoryProductsRepository);
    done();
  });
  it("should be able to delete a product", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await deleteProduct.execute({
      productId,
      userId,
    });

    expect(inMemoryProductsRepository.products[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it("should be able to delete a non existing product", async () => {
    await expect(
      deleteProduct.execute({
        productId: "non-existing-product",
        userId: "example-user-id",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to delete a non existing product that you don't own", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await expect(
      deleteProduct.execute({
        productId,
        userId: "user-is-not-the-owner",
      }),
    ).rejects.toThrow(AppError);
  });
});
