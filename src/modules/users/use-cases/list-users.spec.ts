import { makeUser } from "@test/factories/users-factory";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";

import { ListUsers } from "./list-users";

describe("List users", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let listCustomers: ListUsers;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    listCustomers = new ListUsers(inMemoryUsersRepository);

    done();
  });

  it("should be able to list an users", async () => {
    const user = await inMemoryUsersRepository.create(makeUser());

    const { users } = await listCustomers.execute({
      nameContains: user.name,
      emailContains: user.email,
      roleEquals: user.role,
    });

    expect(users).toHaveLength(1);
  });
});
