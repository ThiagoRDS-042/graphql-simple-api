import { AppError } from "@shared/errors/app-error";

import { makeUser } from "@test/factories/users-factory";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository";

import { Document } from "../entities/document";
import { UpdateUser } from "./update-user";

describe("Update customer", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let updateCustomer: UpdateUser;

  beforeEach(done => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    updateCustomer = new UpdateUser(inMemoryUsersRepository);

    done();
  });

  it("should be able to update a user", async () => {
    const { id: userId } = await inMemoryUsersRepository.create(makeUser());

    const { user } = await updateCustomer.execute({
      email: "user@mail.com",
      name: "john",
      password: "Strong-password2",
      userId,
      phone: "(12) 1.4569-7896",
      document: "123.456.789-10",
    });

    expect(user.email).toEqual("user@mail.com");
    expect(user.name).toEqual("john");
    expect(user.phone.value).toEqual("(12) 1.4569-7896");
    expect(user.document.value).toEqual("123.456.789-10");
    expect(inMemoryUsersRepository.users).toEqual([user]);
  });

  it("should be able to update a user with existing email", async () => {
    await inMemoryUsersRepository.create(
      makeUser({ email: "user@example.com.br" }),
    );

    const { id: userId } = await inMemoryUsersRepository.create(
      makeUser({ email: "user@example.com" }),
    );

    await expect(() =>
      updateCustomer.execute({
        email: "user@example.com.br",
        name: "john doe",
        password: "Strong-password1",
        phone: "(12) 1.4569-7896",
        document: "123.456.789-10",
        userId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a user with existing document", async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        email: "user@example.com.br",
        document: Document.newDocument("123.456.789-10"),
      }),
    );

    const { id: userId } = await inMemoryUsersRepository.create(
      makeUser({ email: "user_test@example.com" }),
    );

    await expect(() =>
      updateCustomer.execute({
        email: "user_test@example.com.br",
        name: "john doe",
        password: "Strong-password1",
        phone: "(12) 1.4569-7896",
        document: "123.456.789-10",
        userId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a non existing user", async () => {
    await expect(() =>
      updateCustomer.execute({
        email: "user@example.com.br",
        name: "john doe",
        password: "Strong-password1",
        userId: "non-existing-user",
        phone: "(12) 1.4569-7896",
        document: "123.456.789-10",
      }),
    ).rejects.toThrow(AppError);
  });
});
