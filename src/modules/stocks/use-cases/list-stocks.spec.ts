import { makeProduct } from "@test/factories/products-factory";
import { makeStock } from "@test/factories/stocks-factory";
import { InMemoryProductsRepository } from "@test/repositories/in-memory-products-repository";
import { InMemoryStocksRepository } from "@test/repositories/in-memory-stocks-repository";

import { ListStocks } from "./list-stocks";

describe("List stocks", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let listStocks: ListStocks;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    listStocks = new ListStocks(inMemoryStocksRepository);
    done();
  });
  it("should be able to list an stocks", async () => {
    const product = await inMemoryProductsRepository.create(makeProduct());

    await inMemoryStocksRepository.create(makeStock({ productId: product.id }));

    inMemoryStocksRepository.stocks[0].product = product;

    const { stocks } = await listStocks.execute({
      userIdEquals: product.userId,
    });

    expect(stocks).toHaveLength(1);
  });
});
