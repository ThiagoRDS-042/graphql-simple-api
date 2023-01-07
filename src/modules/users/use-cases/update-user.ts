import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Document } from "../entities/document";
import { Password } from "../entities/password";
import { Phone } from "../entities/phone";
import { User } from "../entities/user-entity";
import { IUsersRepository } from "../repositories/users-repository";

interface IUpdateUserParams {
  userId: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  document: string;
}

interface IUpdateUserResponse {
  user: User;
}

@injectable()
export class UpdateUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IUpdateUserParams): Promise<IUpdateUserResponse> {
    const { email, name, password, document, phone, userId } = data;

    const userExist = await this.usersRepository.findById(userId);

    if (!userExist) {
      throw new AppError("User does not exists", "USER_NOT_FOUND", 404);
    }

    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);

    if (emailAlreadyInUse && emailAlreadyInUse.id !== userExist.id) {
      throw new AppError("E-mail already in use", "EMAIL_ALREADY_IN_USE", 409);
    }

    const documentAlreadyInUse = await this.usersRepository.findByDocument(
      document,
    );

    if (documentAlreadyInUse && documentAlreadyInUse.id !== userExist.id) {
      throw new AppError(
        "Document already in use",
        "DOCUMENT_ALREADY_IN_USE",
        409,
      );
    }

    let user = User.newUser(
      {
        email,
        name,
        password: Password.newPassword(password),
        phone: Phone.newPhone(phone),
        document: Document.newDocument(document),
        role: userExist.role,
      },
      userId,
    );

    user = await this.usersRepository.save(user);

    return { user };
  }
}
