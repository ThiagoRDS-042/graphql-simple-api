import { container } from "tsyringe";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { Customer } from "@modules/customers/entities/customer-entity";
import {
  CreateCustomer,
  ListCustomers,
  ShowCustomer,
  UpdateCustomer,
  DeleteCustomer,
} from "@modules/customers/use-cases";

import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "../inputs";
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

  @Mutation(() => CustomerModel)
  async updateCustomer(
    @Arg("updateCustomerInput") input: UpdateCustomerInput,
  ): Promise<Customer> {
    const { email, name, password, customerId } = input;

    const updateCustomer = container.resolve(UpdateCustomer);

    const { customer } = await updateCustomer.execute({
      name,
      email,
      password,
      customerId,
    });

    return customer;
  }

  @Mutation(() => Boolean)
  async deleteCustomer(
    @Arg("customerId") customerId: string,
  ): Promise<boolean> {
    const deleteCustomer = container.resolve(DeleteCustomer);

    await deleteCustomer.execute({ customerId });

    return true;
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
