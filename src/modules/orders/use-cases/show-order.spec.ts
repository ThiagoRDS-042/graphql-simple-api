import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeOrder } from "../repositories/factories/orders-factories";
import { InMemoryOrdersRepository } from "../repositories/in-memory/in-memory-orders-repository";
import { ShowOrder } from "./show-order";

describe("Show order", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let showOrder: ShowOrder;

  beforeEach(done => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    showOrder = new ShowOrder(inMemoryOrdersRepository);
    done();
  });

  it("should be able to show a order", async () => {
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

    const { order } = await showOrder.execute({
      orderId,
      currentUser: { userId: "example-user-id", userRole: "ADMIN" },
    });

    expect(inMemoryOrdersRepository.orders).toEqual([order]);
  });

  it("should not be able to show a non existing order", async () => {
    await expect(
      showOrder.execute({
        orderId: "non-existing-order",
        currentUser: { userId: "example-user-id", userRole: "ADMIN" },
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to show a order with a customer is not the owner", async () => {
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

    const currentUser = {
      userId: newCustomer.id,
      userRole: newCustomer.role,
    };

    await expect(
      showOrder.execute({
        orderId,
        currentUser,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to show a order with a seller is not the owner", async () => {
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
      makeUser({ role: "SELLER" }),
    );

    const currentUser = {
      userId: newCustomer.id,
      userRole: newCustomer.role,
    };

    await expect(
      showOrder.execute({
        orderId,
        currentUser,
      }),
    ).rejects.toThrow(AppError);
  });
});
