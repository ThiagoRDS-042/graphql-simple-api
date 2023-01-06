import { container } from "tsyringe";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { Customer } from "@modules/customers/entities/customer-entity";
import { CreateCustomer } from "@modules/customers/use-cases/create-customer";
import { ListCustomers } from "@modules/customers/use-cases/list-customers";
import { ShowCustomer } from "@modules/customers/use-cases/show-customer";

import { CreateCustomerInput } from "../inputs/create-customer-input";
import { ListCustomersInput } from "../inputs/list-customers-input";
import { CustomerModel } from "../models/customer-model";

@Resolver(() => CustomerModel)
export class CustomerResolver {
  @Mutation(() => CustomerModel)
  async createCustomer(
    @Arg("createCustomerInput") input: CreateCustomerInput,
  ): Promise<Customer> {
    const { email, name, password } = input;

    const createCustomer = container.resolve(CreateCustomer);

    const { customer } = await createCustomer.execute({
      name,
      email,
      password,
    });

    return customer;
  }

  @Query(() => [CustomerModel])
  async listCustomers(
    @Arg("listCustomersInput") input: ListCustomersInput,
  ): Promise<Customer[]> {
    const { emailContains, nameContains } = input;

    const listCustomers = container.resolve(ListCustomers);

    const { customers } = await listCustomers.execute({
      emailContains,
      nameContains,
    });

    return customers;
  }

  @Query(() => CustomerModel)
  async showCustomer(@Arg("customerId") customerId: string): Promise<Customer> {
    const showCustomer = container.resolve(ShowCustomer);

    const { customer } = await showCustomer.execute({ customerId });

    return customer;
  }
}
