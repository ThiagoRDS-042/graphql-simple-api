import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { JwtConfig } from "@config/jwt-config";
import { ICustomersRepository } from "@modules/customers/repositories/customers-repository";

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
    @inject("CustomersRepository")
    private readonly customersRepository: ICustomersRepository,
  ) {}

  public async execute(data: IAuthParams): Promise<IAuthResponse> {
    const { email, password } = data;

    const customer = await this.customersRepository.findByEmail(email);

    if (!customer) {
      throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 400);
    }

    const passwordMatch = await compare(password, customer.password.value);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 400);
    }

    const { algorithm, expiresIn, secretKey } = JwtConfig.newJwtConfig();

    const payload = {
      customerName: customer.name,
      customerId: customer.id,
    };

    const accessToken = sign(payload, secretKey, { algorithm, expiresIn });

    return { accessToken };
  }
}
