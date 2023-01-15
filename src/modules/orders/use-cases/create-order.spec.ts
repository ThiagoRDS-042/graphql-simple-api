import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { InMemoryOrdersRepository } from "../repositories/in-memory/in-memory-orders-repository";
import { CreateOrder } from "./create-order";

describe("Create order", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let createOrder: CreateOrder;

  beforeEach(done => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    createOrder = new CreateOrder(
      inMemoryStocksRepository,
      inMemoryProductsRepository,
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    );
    done();
  });

  it("should be able to create a new order", async () => {
    const { id: customerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "CUSTOMER" }),
    );

    const { id: sellerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct({
        userId: sellerId,
      }),
    );

    await inMemoryStocksRepository.create(
      makeStock({
        productId,
        amount: 2,
      }),
    );

    const { order } = await createOrder.execute({
      amount: 2,
      customerId,
      productId,
    });

    expect(inMemoryOrdersRepository.orders).toHaveLength(1);
    expect(inMemoryOrdersRepository.orders).toEqual([order]);
  });

  it("should not be able to create a new order with a non existing product", async () => {
    await expect(
      createOrder.execute({
        amount: 2,
        customerId: "example-customer-id",
        productId: "non-existing-product",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to create a new order with a non existing stock of the product", async () => {
    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct(),
    );

    await expect(
      createOrder.execute({
        amount: 2,
        customerId: "example-customer-id",
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to create a new order with a quantity of products of the stock is less than amount order", async () => {
    const { id: sellerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct({
        userId: sellerId,
      }),
    );

    await inMemoryStocksRepository.create(
      makeStock({
        productId,
        amount: 1,
      }),
    );

    await expect(
      createOrder.execute({
        amount: 2,
        customerId: "example-customer-id",
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to create a new order with a non existing customer", async () => {
    const { id: sellerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct({
        userId: sellerId,
      }),
    );

    await inMemoryStocksRepository.create(
      makeStock({
        productId,
        amount: 2,
      }),
    );

    await expect(
      createOrder.execute({
        amount: 2,
        customerId: "non-existing-customer",
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to create a new order with customer non has a role customer", async () => {
    const { id: customerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: sellerId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct({
        userId: sellerId,
      }),
    );

    await inMemoryStocksRepository.create(
      makeStock({
        productId,
        amount: 2,
      }),
    );

    await expect(
      createOrder.execute({
        amount: 2,
        customerId,
        productId,
      }),
    ).rejects.toThrow(AppError);
  });
});
