import { AppError } from "@shared/errors/app-error";

import { InMemoryCustomersRepository } from "@test/repositories/in-memory-customers-repository";

import { CreateCustomer } from "./create-customer";

describe("Create customer", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let createCustomer: CreateCustomer;

  beforeEach(done => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    createCustomer = new CreateCustomer(inMemoryCustomersRepository);

    done();
  });

  it("should be able to create a new customer", async () => {
    const { customer } = await createCustomer.execute({
      email: "customer@example.com",
      name: "john doe",
      password: "Strong-password1",
      phone: "4569-7896",
    });

    expect(inMemoryCustomersRepository.customers).toHaveLength(1);
    expect(inMemoryCustomersRepository.customers).toEqual([customer]);
  });

  it("should be able to create a new customer with existing email", async () => {
    await createCustomer.execute({
      email: "customer@example.com",
      name: "john doe",
      phone: "4569-7896",
      password: "Strong-password1",
    });

    await expect(() =>
      createCustomer.execute({
        email: "customer@example.com",
        name: "john doe",
        password: "Strong-password1",
        phone: "4569-7896",
      }),
    ).rejects.toThrow(AppError);
  });
});
