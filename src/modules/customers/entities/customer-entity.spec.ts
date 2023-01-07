import { Customer } from "./customer-entity";
import { Password } from "./password";

describe("Customer", () => {
  it("should be able to create a new customer", () => {
    const author = Customer.newCustomer({
      email: "customer@example.com",
      name: "john doe",
      password: Password.newPassword("Strong-password1"),
      phone: "1234-5678",
    });

    expect(author).toBeTruthy();
  });
});
