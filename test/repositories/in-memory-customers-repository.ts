import { IFindManyOptions } from "@modules/customers/dtos/find-many-options";
import { Customer } from "@modules/customers/entities/customer-entity";
import { ICustomersRepository } from "@modules/customers/repositories/customers-repository";

export class InMemoryCustomersRepository implements ICustomersRepository {
  public customers: Customer[] = [];

  public async create(customer: Customer): Promise<Customer> {
    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const customerIndex = this.customers.findIndex(
      item => item.id === customer.id,
    );

    if (customerIndex >= 0) {
      this.customers[customerIndex] = customer;
    }

    return customer;
  }

  public async alreadyExists(email: string): Promise<boolean> {
    const customerAlreadyExists = this.customers.some(
      item => item.email === email,
    );

    return customerAlreadyExists;
  }

  public async findMany(options: IFindManyOptions): Promise<Customer[]> {
    const { emailContains, nameContains } = options;

    let customers = this.customers;

    if (emailContains) {
      customers = customers.filter(item => item.email === emailContains);
    }

    if (nameContains) {
      customers = customers.filter(item => item.name === nameContains);
    }

    return customers;
  }

  public async findById(customerId: string): Promise<Customer | null> {
    const customer = this.customers.find(item => item.id === customerId);

    if (!customer) {
      return null;
    }

    return customer;
  }
}
