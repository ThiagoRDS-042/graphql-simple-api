import { Document } from "@modules/users/entities/document";
import { Password } from "@modules/users/entities/password";
import { Phone } from "@modules/users/entities/phone";
import { RoleType, User } from "@modules/users/entities/user-entity";

interface IRawUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  document: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PrismaUserMapper {
  public static toPrisma(user: User): IRawUser {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone.value,
      document: user.document.value,
      name: user.name,
      role: user.role,
      password: user.password.value,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      updatedAt: user.updatedAt,
    };
  }

  public static toDomain(raw: IRawUser): User {
    return User.newUser(
      {
        email: raw.email,
        phone: Phone.newPhone(raw.phone),
        document: Document.newDocument(raw.document),
        name: raw.name,
        password: Password.newPassword(raw.password, true),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
        role: raw.role,
      },
      raw.id,
    );
  }
}
