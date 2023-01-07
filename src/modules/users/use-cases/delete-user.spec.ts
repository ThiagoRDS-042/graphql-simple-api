import { AppError } from "@shared/errors/app-error";

import { makeUser } from "@test/factories/users-factory";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";

import { DeleteUser } from "./delete-user";

describe("Delete User", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let deleteUser: DeleteUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    deleteUser = new DeleteUser(inMemoryUsersRepository);

    done();
  });

  it("should be able to delete a user", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    await deleteUser.execute({
      userId,
    });

    expect(inMemoryUsersRepository.users[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it("should be able to delete a non existing user", async () => {
    await expect(() =>
      deleteUser.execute({
        userId: "non-existing-user",
      }),
    ).rejects.toThrow(AppError);
  });
});
