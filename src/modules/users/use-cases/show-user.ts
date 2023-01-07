import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { User } from "../entities/user-entity";
import { IUsersRepository } from "../repositories/users-repository";

interface IShowUserParams {
  userId: string;
}

interface IShowUserResponse {
  user: User;
}

@injectable()
export class ShowUser {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IShowUserParams): Promise<IShowUserResponse> {
    const { userId } = data;

    const user = await this.usersRepository.findById(userId);

    if (user === null) {
      throw new AppError("User does not exist", "USER_NOT_FOUND", 404);
    }

    return { user };
  }
}
