import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";

import { makeStock } from "../repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "../repositories/in-memory/in-memory-stocks-repository";
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
