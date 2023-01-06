import { AppError } from "@shared/errors/app-error";

import { makeCustomer } from "@test/factories/customers-factory";
import { InMemoryCustomersRepository } from "@test/repositories/in-memory-customers-repository";

import { ShowCustomer } from "./show-customer";

describe("Show customer", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let showCustomer: ShowCustomer;

  beforeEach(done => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    showCustomer = new ShowCustomer(inMemoryCustomersRepository);

    done();
  });

  it("should be able to show a customer", async () => {
    const { id: customerId } = await inMemoryCustomersRepository.create(
      makeCustomer(),
    );

    const { customer } = await showCustomer.execute({
      customerId,
    });

    expect(inMemoryCustomersRepository.customers).toEqual([customer]);
  });

  it("should be able to show a non existing customer", async () => {
    await expect(() =>
      showCustomer.execute({
        customerId: "non-existing-customer",
      }),
    ).rejects.toThrow(AppError);
  });
});
