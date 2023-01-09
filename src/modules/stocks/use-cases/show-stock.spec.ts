import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@test/factories/products-factory";
import { makeStock } from "@test/factories/stocks-factory";
import { InMemoryProductsRepository } from "@test/repositories/in-memory-products-repository";
import { InMemoryStocksRepository } from "@test/repositories/in-memory-stocks-repository";

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

  it("should be able to show a non existing stock", async () => {
    await expect(
      showStock.execute({
        productId: "non-existing-stock",
      }),
    ).rejects.toThrow(AppError);
  });
});
