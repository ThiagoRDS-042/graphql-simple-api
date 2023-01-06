import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Customer } from "../entities/customer-entity";
import { Password } from "../entities/password";
import { ICustomersRepository } from "../repositories/customers-repository";

interface IUpdateCustomerParams {
  customerId: string;
  email: string;
  name: string;
  password: string;
}

interface IUpdateCustomerResponse {
  customer: Customer;
}

@injectable()
export class UpdateCustomer {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    data: IUpdateCustomerParams,
  ): Promise<IUpdateCustomerResponse> {
    const { email, name, password, customerId } = data;

    const customerExist = await this.customersRepository.findById(customerId);

    if (!customerExist) {
      throw new AppError("Customer does not exists", "CUSTOMER_NOT_FOUND", 404);
    }

    const customerAlreadyExists = await this.customersRepository.alreadyExists(
      email,
    );

    if (customerExist.email !== email && customerAlreadyExists) {
      throw new AppError(
        "Customer already exists",
        "CUSTOMER_ALREADY_EXISTS",
        409,
      );
    }

    let customer = Customer.newCustomer(
      {
        email,
        name,
        password: Password.newPassword(password),
      },
      customerId,
    );

    customer = await this.customersRepository.save(customer);

    return { customer };
  }
}
