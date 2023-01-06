import { makeCustomer } from "@test/factories/customers-factory";
import { InMemoryCustomersRepository } from "@test/repositories/in-memory-customers-repository";

import { ListCustomers } from "./list-customers";

describe("List customers", () => {
  let inMemoryCustomersRepository: InMemoryCustomersRepository;
  let listCustomers: ListCustomers;

  beforeEach(done => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    listCustomers = new ListCustomers(inMemoryCustomersRepository);

    done();
  });

  it("should be able to list an customers", async () => {
    const customer = await inMemoryCustomersRepository.create(makeCustomer());

    const { customers } = await listCustomers.execute({
      nameContains: customer.name,
      emailContains: customer.email,
    });

    expect(customers).toHaveLength(1);
  });
});
