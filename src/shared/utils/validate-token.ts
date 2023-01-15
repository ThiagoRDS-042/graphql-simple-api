import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

import { AppError } from "@shared/errors/app-error";

import { JwtConfig } from "@config/jwt-config";

interface IPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface IResponse {
  userId: string;
}

export const validateToken = (token: string): IResponse => {
  try {
    const { secretKey, algorithm } = JwtConfig.newJwtConfig();

    const { userId } = verify(token, secretKey, {
      algorithms: [algorithm],
    }) as IPayload;

    return { userId };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError("Expired token", "EXPIRED_TOKEN", 401);
    } else if (error instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", "INVALID_TOKEN", 401);
    } else {
      throw new AppError("Unauthorized", "UNAUTHORIZED", 401);
    }
  }
};
