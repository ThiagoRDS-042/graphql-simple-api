import { prisma } from "@shared/infra/database/prisma/prisma-client";

import { IFindManyOptions } from "@modules/customers/dtos/find-many-options";
import { Customer } from "@modules/customers/entities/customer-entity";
import { ICustomersRepository } from "@modules/customers/repositories/customers-repository";

import { PrismaCustomerMapper } from "../mappers/prisma-customer-mapper";

export class PrismaCustomersRepository implements ICustomersRepository {
  public async create(customer: Customer): Promise<Customer> {
    const raw = PrismaCustomerMapper.toPrisma(customer);

    const customerCreated = await prisma.customer.create({
      data: raw,
    });

    return PrismaCustomerMapper.toDomain(customerCreated);
  }

  public async save(customer: Customer): Promise<Customer> {
    const raw = PrismaCustomerMapper.toPrisma(customer);

    const customerUpdated = await prisma.customer.update({
      where: { id: raw.id },
      data: raw,
    });

    return PrismaCustomerMapper.toDomain(customerUpdated);
  }

  public async alreadyExists(email: string): Promise<boolean> {
    const customer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    return !!customer;
  }

  public async findMany(options: IFindManyOptions): Promise<Customer[]> {
    const { emailContains, nameContains } = options;

    const customers = await prisma.customer.findMany({
      where: {
        email: {
          contains: emailContains,
        },
        name: {
          contains: nameContains,
        },
        deletedAt: null,
      },
    });

    return customers.map(PrismaCustomerMapper.toDomain);
  }

  public async findById(customerId: string): Promise<Customer | null> {
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        deletedAt: null,
      },
    });

    if (!customer) {
      return null;
    }

    return PrismaCustomerMapper.toDomain(customer);
  }
}
