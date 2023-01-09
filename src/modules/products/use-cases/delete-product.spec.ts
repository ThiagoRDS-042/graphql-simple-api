import { AppError } from "@shared/errors/app-error";

import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";

import { makeProduct } from "../repositories/factories/products-factory";
import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products-repository";
import { DeleteProduct } from "./delete-product";

describe("Delete product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let deleteProduct: DeleteProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    deleteProduct = new DeleteProduct(
      inMemoryProductsRepository,
      inMemoryStocksRepository,
    );
    done();
  });
  it("should be able to delete a product and your stock", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await inMemoryStocksRepository.create(makeStock({ productId }));

    await deleteProduct.execute({
      productId,
      userId,
    });

    expect(inMemoryProductsRepository.products[0].deletedAt).toEqual(
      expect.any(Date),
    );
    expect(inMemoryStocksRepository.stocks[0].deletedAt).toEqual(
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
