import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IUsersRepository } from "../repositories/interfaces/users-repository";

interface IActiveUserParams {
  email: string;
}

@injectable()
export class ActiveUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IActiveUserParams): Promise<void> {
    const { email } = data;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists", "USER_NOT_FOUND", 404);
    }

    if (user.deletedAt === null) {
      throw new AppError(
        "User already is active",
        "USER_ALREADY_IS_ACTIVE",
        404,
      );
    }

    user.active();

    await this.usersRepository.save(user);
  }
}
