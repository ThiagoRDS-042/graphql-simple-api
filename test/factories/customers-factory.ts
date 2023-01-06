import {
  Customer,
  ICustomerProps,
} from "@modules/customers/entities/customer-entity";
import { Password } from "@modules/customers/entities/password";

type Override = Partial<ICustomerProps>;

export const makeCustomer = (override: Override = {}): Customer => {
  return Customer.newCustomer({
    email: "customer@example.com.br",
    name: "john doe",
    password: Password.newPassword("Strong-password1"),
    ...override,
  });
};
