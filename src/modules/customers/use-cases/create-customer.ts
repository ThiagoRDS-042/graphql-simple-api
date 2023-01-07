import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Customer } from "../entities/customer-entity";
import { Password } from "../entities/password";
import { ICustomersRepository } from "../repositories/customers-repository";

interface ICreateCustomerParams {
  email: string;
  name: string;
  phone: string;
  password: string;
}

interface ICreateCustomerResponse {
  customer: Customer;
}

@injectable()
export class CreateCustomer {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    data: ICreateCustomerParams,
  ): Promise<ICreateCustomerResponse> {
    const { email, name, password, phone } = data;

    const customerAlreadyExists = await this.customersRepository.alreadyExists(
      email,
    );

    if (customerAlreadyExists) {
      throw new AppError(
        "Customer already exists",
        "CUSTOMER_ALREADY_EXISTS",
        409,
      );
    }

    let customer = Customer.newCustomer({
      email,
      name,
      password: Password.newPassword(password),
      phone,
    });

    customer = await this.customersRepository.create(customer);

    return { customer };
  }
}
