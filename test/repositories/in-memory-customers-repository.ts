import { Customer } from "@modules/customers/entities/customer-entity";
import { ICustomersRepository } from "@modules/customers/repositories/customers-repository";

export class InMemoryCustomersRepository implements ICustomersRepository {
  public customers: Customer[] = [];

  public async create(customer: Customer): Promise<void> {
    this.customers.push(customer);
  }
  public async alreadyExists(email: string): Promise<boolean> {
    const customerAlreadyExists = this.customers.some(
      item => item.email === email,
    );

    return customerAlreadyExists;
  }

  // async save(customer: Customer): Promise<void> {
  //   const customerIndex = this.customers.findIndex((item) => item.id === customer.id);

  //   if (customerIndex >= 0) {
  //     this.customers[customerIndex] = customer;
  //   }
  // }
}
