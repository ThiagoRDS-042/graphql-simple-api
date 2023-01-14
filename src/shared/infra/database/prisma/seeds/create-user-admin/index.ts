import { Document } from "@modules/users/entities/document";
import { Password } from "@modules/users/entities/password";
import { Phone } from "@modules/users/entities/phone";
import { User } from "@modules/users/entities/user-entity";
import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/prisma-users-repository";

export class CreateUserAdmin {
  public async run(): Promise<void> {
    await this.execute();
  }

  private async execute(): Promise<void> {
    const prismaUsersRepository = new PrismaUsersRepository();

    const userAdminAlreadyExists = await prismaUsersRepository.findByEmail(
      `${process.env.USER_ADMIN_PASSWORD}`,
    );

    if (userAdminAlreadyExists) {
      await prismaUsersRepository.create(
        User.newUser({
          name: `${process.env.USER_ADMIN_NAME}`,
          email: `${process.env.USER_ADMIN_EMAIL}`,
          document: Document.newDocument(`${process.env.USER_ADMIN_DOCUMENT}`),
          password: Password.newPassword(`${process.env.USER_ADMIN_PASSWORD}`),
          phone: Phone.newPhone(`${process.env.USER_ADMIN_PHONE}`),
          role: "ADMIN",
        }),
      );
    }
  }
}
