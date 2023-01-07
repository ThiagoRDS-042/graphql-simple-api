import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { IUsersRepository } from "../repositories/users-repository";

interface IDeleteUserParams {
  userId: string;
}

@injectable()
export class DeleteUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IDeleteUserParams): Promise<void> {
    const { userId } = data;

    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError("User does not exist", "USER_NOT_FOUND", 404);
    }

    user.delete();

    await this.usersRepository.save(user);
  }
}
