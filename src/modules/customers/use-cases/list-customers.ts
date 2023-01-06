import { inject, injectable } from "tsyringe";

import { Customer } from "../entities/customer-entity";
import { ICustomersRepository } from "../repositories/customers-repository";

interface IListCustomersParams {
  emailContains?: string;
  nameContains?: string;
}

interface IListCustomersResponse {
  customers: Customer[];
}

@injectable()
export class ListCustomers {
  constructor(
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(
    data: IListCustomersParams,
  ): Promise<IListCustomersResponse> {
    const { emailContains, nameContains } = data;

    const customers = await this.customersRepository.findMany({
      emailContains,
      nameContains,
    });

    return { customers };
  }
}
