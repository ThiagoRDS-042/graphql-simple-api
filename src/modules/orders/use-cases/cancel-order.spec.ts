import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeOrder } from "../repositories/factories/orders-factories";
import { InMemoryOrdersRepository } from "../repositories/in-memory/in-memory-orders-repository";
import { CancelOrder } from "./cancel-order";

describe("Cancel order", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let cancelOrder: CancelOrder;

  beforeEach(done => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    cancelOrder = new CancelOrder(inMemoryOrdersRepository);
    done();
  });

  it("should be able to cancel a order", async () => {
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

    const { id: orderId } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    await cancelOrder.execute({
      orderId,
      customerId: customerId,
    });

    expect(inMemoryOrdersRepository.orders[0].canceledAt).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to cancel a non existing order", async () => {
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

    const { id: orderId } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    await cancelOrder.execute({
      orderId,
      customerId: customerId,
    });

    await expect(
      cancelOrder.execute({
        orderId,
        customerId: customerId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to cancel a order that is already cancelled.", async () => {
    await expect(
      cancelOrder.execute({
        orderId: "non-existing-order",
        customerId: "example-customer-id",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to cancel a order with a customer is not the owner", async () => {
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

    const { id: orderId } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    const newCustomer = await inMemoryUsersRepository.create(
      makeUser({ role: "CUSTOMER" }),
    );

    await expect(
      cancelOrder.execute({
        orderId,
        customerId: newCustomer.id,
      }),
    ).rejects.toThrow(AppError);
  });
});
