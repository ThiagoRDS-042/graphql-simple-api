import { Document } from "@modules/users/entities/document";
import { Password } from "@modules/users/entities/password";
import { Phone } from "@modules/users/entities/phone";
import { IUserProps, User } from "@modules/users/entities/user-entity";

type Override = Partial<IUserProps>;

export const makeUser = (override: Override = {}): User => {
  return User.newUser({
    email: "user_customer@example.com.br",
    name: "john doe",
    password: Password.newPassword("Strong-password1"),
    phone: Phone.newPhone("(12) 1.1234-5678"),
    document: Document.newDocument("123.456.789-10"),
    role: "CUSTOMER",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...override,
  });
};
