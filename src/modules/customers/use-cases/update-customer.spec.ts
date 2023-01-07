import { AppError } from "@shared/errors/app-error";

import { makeCustomer } from "@test/factories/customers-factory";
import { InMemoryCustomersRepository } from "@test/repositories/in-memory-customers-repository";

import { UpdateCustomer } from "./update-customer";

describe("Update customer", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let updateCustomer: UpdateCustomer;

  beforeEach(done => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    updateCustomer = new UpdateCustomer(inMemoryCustomersRepository);

    done();
  });

  it("should be able to update a customer", async () => {
    const { id: customerId } = await inMemoryCustomersRepository.create(
      makeCustomer(),
    );

    const { customer } = await updateCustomer.execute({
      email: "customer@mail.com",
      name: "john",
      password: "Strong-password2",
      customerId,
      phone: "4569-7896",
    });

    expect(customer.email).toEqual("customer@mail.com");
    expect(customer.name).toEqual("john");
    expect(inMemoryCustomersRepository.customers).toEqual([customer]);
  });

  it("should be able to update a customer with existing email", async () => {
    await inMemoryCustomersRepository.create(
      makeCustomer({ email: "customer@example.com.br" }),
    );

    const { id: customerId } = await inMemoryCustomersRepository.create(
      makeCustomer({ email: "customer@example.com" }),
    );

    await expect(() =>
      updateCustomer.execute({
        email: "customer@example.com.br",
        name: "john doe",
        password: "Strong-password1",
        phone: "4569-7896",
        customerId,
      }),
    ).rejects.toThrow(AppError);
  });

  it("should be able to update a non existing customer", async () => {
    await expect(() =>
      updateCustomer.execute({
        email: "customer@example.com.br",
        name: "john doe",
        password: "Strong-password1",
        customerId: "non-existing-customer",
        phone: "4569-7896",
      }),
    ).rejects.toThrow(AppError);
  });
});
