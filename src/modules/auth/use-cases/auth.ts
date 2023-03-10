import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { JwtConfig } from "@config/jwt-config";
import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

interface IAuthParams {
  email: string;
  password: string;
}

interface IAuthResponse {
  accessToken: string;
}

@injectable()
export class Auth {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IAuthParams): Promise<IAuthResponse> {
    const { email, password } = data;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 400);
    }

    const passwordMatch = await compare(password, user.password.value);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 400);
    }

    if (user.deletedAt !== null) {
      throw new AppError("User has been deleted", "USER_HAS_BEEN_DELETED", 403);
    }

    const { algorithm, expiresIn, secretKey } = JwtConfig.newJwtConfig();

    const payload = {
      userId: user.id,
      userRole: user.role,
    };

    const accessToken = sign(payload, secretKey, { algorithm, expiresIn });

    return { accessToken };
  }
}
