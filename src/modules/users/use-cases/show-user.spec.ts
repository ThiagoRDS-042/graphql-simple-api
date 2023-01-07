import { AppError } from "@shared/errors/app-error";

import { makeUser } from "@test/factories/users-factory";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";

import { ShowUser } from "./show-user";

describe("Show user", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let showCustomer: ShowUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showCustomer = new ShowUser(inMemoryUsersRepository);

    done();
  });

  it("should be able to show a user", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    const { user } = await showCustomer.execute({
      userId,
    });

    expect(inMemoryUsersRepository.users).toEqual([user]);
  });

  it("should be able to show a non existing user", async () => {
    await expect(() =>
      showCustomer.execute({
        userId: "non-existing-user",
      }),
    ).rejects.toThrow(AppError);
  });
});
