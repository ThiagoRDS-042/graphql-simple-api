import { AppError } from "@shared/errors/app-error";

import { makeProduct } from "@modules/products/repositories/factories/products-factory";
import { InMemoryProductsRepository } from "@modules/products/repositories/in-memory/in-memory-products-repository";
import { makeStock } from "@modules/stocks/repositories/factories/stocks-factory";
import { InMemoryStocksRepository } from "@modules/stocks/repositories/in-memory/in-memory-stocks-repository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeUser } from "../repositories/factories/users-factory";
import { DeleteUser } from "./delete-user";

describe("Delete User", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryStocksRepository: InMemoryStocksRepository;
  let deleteUser: DeleteUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryStocksRepository = new InMemoryStocksRepository();
    deleteUser = new DeleteUser(
      inMemoryUsersRepository,
      inMemoryProductsRepository,
      inMemoryStocksRepository,
    );

    done();
  });

  it("should be able to delete a user and your dependencies", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(
      makeUser({ role: "SELLER" }),
    );

    const { id: productId } = await inMemoryProductsRepository.create(
      makeProduct({ userId }),
    );

    await inMemoryStocksRepository.create(makeStock({ productId }));

    await deleteUser.execute({
      userId,
    });

    expect(inMemoryUsersRepository.users[0].deletedAt).toEqual(
      expect.any(Date),
    );
    expect(inMemoryProductsRepository.products[0].deletedAt).toEqual(
      expect.any(Date),
    );
    expect(inMemoryStocksRepository.stocks[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it("should not be able to delete a non existing user", async () => {
    await expect(() =>
      deleteUser.execute({
        userId: "non-existing-user",
      }),
    ).rejects.toThrow(AppError);
  });
});
