import { Customer } from "@modules/customers/entities/customer-entity";
import { Password } from "@modules/customers/entities/password";

interface IRawCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PrismaCustomerMapper {
  public static toPrisma(customer: Customer): IRawCustomer {
    return {
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
      password: customer.password.value,
      createdAt: customer.createdAt,
      deletedAt: customer.deletedAt,
      updatedAt: customer.updatedAt,
    };
  }

  public static toDomain(raw: IRawCustomer): Customer {
    return Customer.newCustomer(
      {
        email: raw.email,
        phone: raw.phone,
        name: raw.name,
        password: Password.newPassword(raw.password, true),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      raw.id,
    );
  }
}
