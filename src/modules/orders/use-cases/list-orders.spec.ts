import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { makeUser } from "@modules/users/repositories/factories/users-factory";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeOrder } from "../repositories/factories/orders-factories";
import { InMemoryOrdersRepository } from "../repositories/in-memory/in-memory-orders-repository";
import { ListOrders } from "./list-orders";

describe("List orders", () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let listOrders: ListOrders;

  beforeEach(done => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    listOrders = new ListOrders(inMemoryOrdersRepository);
    done();
  });

  it("should be able to list an orders", async () => {
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

    const {
      customerId: customerIdEquals,
      productId: productIdEquals,
      sellerId: sellerIdEquals,
      canceledAt,
    } = await inMemoryOrdersRepository.create(
      makeOrder({ customerId, productId, sellerId, amount: 1 }),
    );

    const { orders } = await listOrders.execute({
      customerIdEquals,
      isCanceled: !!canceledAt,
      productIdEquals,
      sellerIdEquals,
    });

    expect(orders).toHaveLength(1);
  });
});
