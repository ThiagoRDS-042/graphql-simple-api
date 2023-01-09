import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";

import { makeStock } from "../repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "../repositories/in-memory/in-memory-stocks-repository";
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
