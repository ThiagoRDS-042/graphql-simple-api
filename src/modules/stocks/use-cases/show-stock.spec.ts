import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";

import { makeStock } from "../repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "../repositories/in-memory/in-memory-stocks-repository";
import { ShowStock } from "./show-stock";

describe("Show stock", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let showStock: ShowStock;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    showStock = new ShowStock(inMemoryStocksRepository);
    done();
  });
  it("should be able to show a stock to the product", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await inMemoryStocksRepository.create(makeStock({ productId }));

    const { stock } = await showStock.execute({
      productId,
    });

    expect(inMemoryStocksRepository.stocks).toEqual([stock]);
  });

  it("should not be able to show a non existing stock", async () => {
    await expect(
      showStock.execute({
        productId: "non-existing-stock",
      }),
    ).rejects.toThrow(AppError);
  });
});
