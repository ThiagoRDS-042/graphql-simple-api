import { AppError } from "@shared/errors/app-error";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeUser } from "../repositories/factories/users-factory";
import { ActiveUser } from "./active-user";

describe("Active user", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let activeUser: ActiveUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    activeUser = new ActiveUser(inMemoryUsersRepository);

    done();
  });

  it("should be able to active a deleted user", async () => {
    const user = await inMemoryUsersRepository.create(makeUser());

    user.delete();

    await activeUser.execute({ email: user.email });

    expect(inMemoryUsersRepository.users[0].deletedAt).toBeNull();
  });

  it("should not be able to active a not deleted user", async () => {
    const { email } = await inMemoryUsersRepository.create(makeUser());

    await expect(activeUser.execute({ email })).rejects.toThrow(AppError);
  });

  it("should not be able to active a non existing user", async () => {
    await expect(
      activeUser.execute({ email: "non-existing-user" }),
    ).rejects.toThrow(AppError);
  });
});
