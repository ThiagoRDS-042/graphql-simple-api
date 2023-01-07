import { Document } from "./document";
import { Password } from "./password";
import { Phone } from "./phone";
import { User } from "./user-entity";

describe("User", () => {
  it("should be able to create a new user customer", () => {
    const user = User.newUser({
      email: "user_customer@example.com",
      name: "john doe",
      password: Password.newPassword("Strong-password1"),
      phone: Phone.newPhone("(12) 1.1234-5678"),
      document: Document.newDocument("123.456.789-10"),
      role: "CUSTOMER",
    });

    expect(user).toBeTruthy();
  });

  it("should be able to create a new user seller", () => {
    const user = User.newUser({
      email: "user_seller@example.com",
      name: "john doe",
      password: Password.newPassword("Strong-password1"),
      phone: Phone.newPhone("(12) 1.1234-5678"),
      document: Document.newDocument("123.456.789-10"),
      role: "SELLER",
    });

    expect(user).toBeTruthy();
  });

  it("should be able to create a new user customer", () => {
    const user = User.newUser({
      email: "user_admin@example.com",
      name: "john doe",
      password: Password.newPassword("Strong-password1"),
      phone: Phone.newPhone("(12) 1.1234-5678"),
      document: Document.newDocument("123.456.789-10"),
      role: "ADMIN",
    });

    expect(user).toBeTruthy();
  });
});
