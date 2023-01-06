import { IFindManyOptions } from "../dtos/find-many-options";
import { Customer } from "../entities/customer-entity";

export interface ICustomersRepository {
  create(customer: Customer): Promise<Customer>;
  save(customer: Customer): Promise<Customer>;
  alreadyExists(email: string): Promise<boolean>;
  findMany(options: IFindManyOptions): Promise<Customer[]>;
  findById(customerId: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
}
