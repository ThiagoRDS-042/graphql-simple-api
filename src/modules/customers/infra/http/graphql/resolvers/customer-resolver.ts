import { container } from "tsyringe";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import {
  ICurrentCustomer,
  CurrentCustomer,
} from "@shared/infra/http/decorators/current-customer";
import { ensureAuthenticated } from "@shared/infra/http/middleware/ensureAuthenticated";

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

  @UseMiddleware(ensureAuthenticated)
  @Mutation(() => CustomerModel)
  async updateCustomer(
    @Arg("updateCustomerInput") input: UpdateCustomerInput,
    @CurrentCustomer() currentCustomer: ICurrentCustomer,
  ): Promise<Customer> {
    const { email, name, password } = input;
    const { customerId } = currentCustomer;

    const updateCustomer = container.resolve(UpdateCustomer);

    const { customer } = await updateCustomer.execute({
      name,
      email,
      password,
      customerId,
    });

    return customer;
  }

  @UseMiddleware(ensureAuthenticated)
  @Mutation(() => Boolean)
  async deleteCustomer(
    @CurrentCustomer() currentCustomer: ICurrentCustomer,
  ): Promise<boolean> {
    const { customerId } = currentCustomer;

    const deleteCustomer = container.resolve(DeleteCustomer);

    await deleteCustomer.execute({ customerId });

    return true;
  }

  @UseMiddleware(ensureAuthenticated)
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

  @UseMiddleware(ensureAuthenticated)
  @Query(() => CustomerModel)
  async showCustomer(
    @CurrentCustomer() currentCustomer: ICurrentCustomer,
  ): Promise<Customer> {
    const { customerId } = currentCustomer;

    const showCustomer = container.resolve(ShowCustomer);

    const { customer } = await showCustomer.execute({ customerId });

    return customer;
  }
}
