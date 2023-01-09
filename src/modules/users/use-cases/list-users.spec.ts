import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/in-memory-users-repository";

import { makeUser } from "../repositories/factories/users-factory";
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
    const {
      name: nameContains,
      email: emailContains,
      role: roleEquals,
    } = await inMemoryUsersRepository.create(makeUser());

    const { users } = await listCustomers.execute({
      nameContains,
      emailContains,
      roleEquals,
    });

    expect(users).toHaveLength(1);
  });
});
