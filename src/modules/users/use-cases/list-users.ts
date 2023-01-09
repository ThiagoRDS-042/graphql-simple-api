import { inject, injectable } from "tsyringe";

import { RoleType, User } from "../entities/user-entity";
import { IUsersRepository } from "../repositories/interfaces/users-repository";

interface IListUsersParams {
  emailContains?: string;
  nameContains?: string;
  roleEquals?: RoleType;
}

interface IListUsersResponse {
  users: User[];
}

@injectable()
export class ListUsers {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IListUsersParams): Promise<IListUsersResponse> {
    const { emailContains, nameContains, roleEquals } = data;

    const users = await this.usersRepository.findMany({
      emailContains,
      nameContains,
      roleEquals,
    });

    return { users };
  }
}
