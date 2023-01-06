import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { ICustomersRepository } from "../repositories/customers-repository";

interface IDeleteCustomerParams {
  customerId: string;
}

@injectable()
export class DeleteCustomer {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(data: IDeleteCustomerParams): Promise<void> {
    const { customerId } = data;

    const customer = await this.customersRepository.findById(customerId);

    if (customer === null) {
      throw new AppError("Customer does not exist", "CUSTOMER_NOT_FOUND", 404);
    }

    customer.delete();

    await this.customersRepository.save(customer);
  }
}
