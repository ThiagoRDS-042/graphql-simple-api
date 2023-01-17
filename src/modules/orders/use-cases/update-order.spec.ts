import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeOrder } from "../repositories/factories/orders-factories";
import { InMemoryOrdersRepository } from "../repositories/in-memory/in-memory-orders-repository";
import { UpdateOrder } from "./update-order";

describe("Update order", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let updateOrder: UpdateOrder;

  beforeEach(done => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    updateOrder = new UpdateOrder(
      inMemoryStocksRepository,
      inMemoryProductsRepository,
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    );
    done();
  });

  it("should be able to update a order", async () => {
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

    const { order } = await updateOrder.execute({
      amount: 2,
      customerId,
      orderId,
      productId,
    });

    expect(order.amount).toBe(2);
  });

  it("should not be able to update a non existing order", async () => {
    await expect(
      updateOrder.execute({
        amount: 2,
        customerId: "example-customer-id",
        orderId: "non-existing-order",
        productId: "example-product-id",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to update a order canceled", async () => {
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

    const order = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    order.cancel();

    await expect(
      updateOrder.execute({
        amount: 2,
        customerId,
        orderId: order.id,
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to update a order with a customer is not the owner", async () => {
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
      updateOrder.execute({
        amount: 2,
        customerId: newCustomer.id,
        orderId,
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to update a order with a non existing product", async () => {
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

    await expect(
      updateOrder.execute({
        amount: 2,
        customerId,
        orderId,
        productId: "non-existing-product",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to update a order with a non existing stock of the product", async () => {
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

    const { id: orderId } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    await expect(
      updateOrder.execute({
        amount: 2,
        customerId,
        orderId,
        productId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should not be able to update a order with a quantity of products of the stock is less than amount order", async () => {
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
        amount: 1,
      }),
    );

    const { id: orderId } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    await expect(
      updateOrder.execute({
        amount: 2,
        customerId,
        orderId,
        productId,
      }),
    ).rejects.toThrow(AppError);
  });
});
