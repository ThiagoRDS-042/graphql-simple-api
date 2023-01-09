import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@test/factories/products-factory";
import { makeStock } from "@test/factories/stocks-factory";
import { InMemoryProductsRepository } from "@test/repositories/in-memory-products-repository";
import { InMemoryStocksRepository } from "@test/repositories/in-memory-stocks-repository";

import { UpdateStock } from "./update-stock";

describe("Update stock", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let updateStock: UpdateStock;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    updateStock = new UpdateStock(
      inMemoryStocksRepository,
      inMemoryProductsRepository,
    );
    done();
  });
  it("should be able to create a stock to the product", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await inMemoryStocksRepository.create(makeStock({ productId }));

    const { stock } = await updateStock.execute({
      amount: 2,
      productId,
      userId,
    });

    expect(stock.amount).toEqual(2);
    expect(inMemoryStocksRepository.stocks).toEqual([stock]);
  });

  it("should be able to update a stock with a non existing product", async () => {
    await expect(
      updateStock.execute({
        amount: 0,
        productId: "non-existing-product",
        userId: "example-user",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a stock with that you don't own the product", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await inMemoryStocksRepository.create(makeStock({ productId }));

    await expect(
      updateStock.execute({
        amount: 0,
        productId,
        userId: "user-is-not-the-owner",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a non existing stock", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await expect(
      updateStock.execute({
        amount: 0,
        productId,
        userId,
      }),
    ).rejects.toThrow(AppError);
  });
});
