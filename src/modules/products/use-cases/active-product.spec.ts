import { AppError } from "@shared/errors/app-error";

import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeProduct } from "../repositories/factories/products-factory";
import { InMemoryProductsRepository } from "../repositories/in-memory/in-memory-products-repository";
import { ActiveProduct } from "./active-product";

describe("Active product", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let activeProduct: ActiveProduct;

  beforeEach(done => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    activeProduct = new ActiveProduct(
      inMemoryProductsRepository,
      inMemoryUsersRepository,
      inMemoryStocksRepository,
    );
    done();
  });

  it("should be able to active a deleted product", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    const product = await inMemoryProductsRepository.create(
      makeProduct({ userId }),
    );

    const stock = await inMemoryStocksRepository.create(
      makeStock({ productId: product.id }),
    );

    product.delete();
    stock.delete();

    await activeProduct.execute({
      productId: product.id,
      userId,
    });

    expect(inMemoryProductsRepository.products[0].deletedAt).toBeNull();
    expect(inMemoryStocksRepository.stocks[0].deletedAt).toBeNull();
  });

  it("should not be able to active a non existing product", async () => {
    await expect(
      activeProduct.execute({
        productId: "non-existing-product",
        userId: "example-user-id",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to active a deleted product with a non existing user", async () => {
    const product = await inMemoryProductsRepository.create(makeProduct());

    const stock = await inMemoryStocksRepository.create(
      makeStock({ productId: product.id }),
    );

    product.delete();
    stock.delete();

    await expect(
      activeProduct.execute({
        productId: product.id,
        userId: "non-existing-user",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to active a deleted product that you don't own", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    const product = await inMemoryProductsRepository.create(
      makeProduct({ userId }),
    );

    const stock = await inMemoryStocksRepository.create(
      makeStock({ productId: product.id }),
    );

    product.delete();
    stock.delete();

    const newUser = await inMemoryUsersRepository.create(makeUser());

    await expect(
      activeProduct.execute({
        productId: product.id,
        userId: newUser.id,
      }),
    ).rejects.toThrow(AppError);
  });
});
