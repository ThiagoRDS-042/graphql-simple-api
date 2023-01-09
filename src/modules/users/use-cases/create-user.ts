import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Document } from "../entities/document";
import { Password } from "../entities/password";
import { Phone } from "../entities/phone";
import { RoleType, User } from "../entities/user-entity";
import { IUsersRepository } from "../repositories/interfaces/users-repository";

interface ICreateUserParams {
  email: string;
  name: string;
  phone: string;
  password: string;
  document: string;
  role: RoleType;
}

interface ICreateUserResponse {
  user: User;
}

@injectable()
export class CreateUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: ICreateUserParams): Promise<ICreateUserResponse> {
    const { email, name, password, phone, document, role } = data;

    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new AppError("E-mail already in use", "EMAIL_ALREADY_IN_USE", 409);
    }

    const documentAlreadyInUse = await this.usersRepository.findByDocument(
      document,
    );

    if (documentAlreadyInUse) {
      throw new AppError(
        "Document already in use",
        "DOCUMENT_ALREADY_IN_USE",
        409,
      );
    }

    let user = User.newUser({
      email,
      name,
      password: Password.newPassword(password),
      phone: Phone.newPhone(phone),
      document: Document.newDocument(document),
      role,
    });

    user = await this.usersRepository.create(user);

    return { user };
  }
}
