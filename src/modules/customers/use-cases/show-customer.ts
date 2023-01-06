import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Customer } from "../entities/customer-entity";
import { ICustomersRepository } from "../repositories/customers-repository";

interface IShowCustomerParams {
  customerId: string;
}

interface IShowCustomerResponse {
  customer: Customer;
}

@injectable()
export class ShowCustomer {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    data: IShowCustomerParams,
  ): Promise<IShowCustomerResponse> {
    const { customerId } = data;

    const customer = await this.customersRepository.findById(customerId);

    if (customer === null) {
      throw new AppError("Customer does not exist", "CUSTOMER_NOT_FOUND", 404);
    }

    return { customer };
  }
}
