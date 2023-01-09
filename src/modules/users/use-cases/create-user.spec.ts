import { AppError } from "@shared/errors/app-error";

import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";

import { CreateUser } from "./create-user";

describe("Create user", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUser: CreateUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUser = new CreateUser(inMemoryUsersRepository);

    done();
  });

  it("should be able to create a new user", async () => {
    const { user } = await createUser.execute({
      email: "user@example.com",
      name: "john doe",
      password: "Strong-password1",
      phone: "(12) 1.1234-5678",
      document: "123.456.789-10",
      role: "CUSTOMER",
    });

    expect(inMemoryUsersRepository.users).toHaveLength(1);
    expect(inMemoryUsersRepository.users).toEqual([user]);
  });

  it("should be able to create a new user with existing email", async () => {
    await createUser.execute({
      email: "user@example.com",
      name: "john doe",
      password: "Strong-password1",
      phone: "(12) 1.1234-5678",
      document: "123.456.789-10",
      role: "CUSTOMER",
    });

    await expect(() =>
      createUser.execute({
        email: "user@example.com",
        name: "john doe",
        password: "Strong-password1",
        phone: "(12) 1.1234-5678",
        document: "123.456.789-10",
        role: "CUSTOMER",
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to create a new user with existing document", async () => {
    await createUser.execute({
      email: "user@example.com",
      name: "john doe",
      password: "Strong-password1",
      phone: "(12) 1.1234-5678",
      document: "123.456.789-10",
      role: "CUSTOMER",
    });

    await expect(() =>
      createUser.execute({
        email: "user2@example.com",
        name: "john doe",
        password: "Strong-password1",
        phone: "(12) 1.1234-5678",
        document: "123.456.789-10",
        role: "CUSTOMER",
      }),
    ).rejects.toThrow(AppError);
  });
});
