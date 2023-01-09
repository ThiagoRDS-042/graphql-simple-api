import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";

import { InMemoryStocksRepository } from "../repositories/in-memory/in-memory-stocks-repository";
import { CreateStock } from "./create-stock";

describe("Create stock", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let createStock: CreateStock;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    createStock = new CreateStock(
      inMemoryStocksRepository,
      inMemoryProductsRepository,
    );
    done();
  });
  it("should be able to create a new stock to the product", async () => {
    const { id: productId, userId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    const { stock } = await createStock.execute({
      amount: 2,
      productId,
      userId,
    });

    expect(inMemoryStocksRepository.stocks).toHaveLength(1);
    expect(inMemoryStocksRepository.stocks).toEqual([stock]);
  });

  it("should be able to create a new stock with a non existing product", async () => {
    await expect(
      createStock.execute({
        amount: 0,
        productId: "non-existing-product",
        userId: "example-user",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to create a new stock with that you don't own the product", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await expect(
      createStock.execute({
        amount: 0,
        productId,
        userId: "user-is-not-the-owner",
      }),
    ).rejects.toThrow(AppError);
  });
});
