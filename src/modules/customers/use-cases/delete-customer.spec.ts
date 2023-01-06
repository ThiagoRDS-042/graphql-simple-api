import { AppError } from "@shared/errors/app-error";

import { makeCustomer } from "@test/factories/customers-factory";
import { InMemoryCustomersRepository } from "@test/repositories/in-memory-customers-repository";

import { DeleteCustomer } from "./delete-customer";

describe("Delete customer", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let deleteCustomer: DeleteCustomer;

  beforeEach(done => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    deleteCustomer = new DeleteCustomer(inMemoryCustomersRepository);

    done();
  });

  it("should be able to delete a customer", async () => {
    const { id: customerId } = await inMemoryCustomersRepository.create(
      makeCustomer(),
    );

    await deleteCustomer.execute({
      customerId,
    });

    expect(inMemoryCustomersRepository.customers[0].deletedAt).toEqual(
      expect.any(Date),
    );
  });

  it("should be able to delete a non existing customer", async () => {
    await expect(() =>
      deleteCustomer.execute({
        customerId: "non-existing-customer",
      }),
    ).rejects.toThrow(AppError);
  });
});
