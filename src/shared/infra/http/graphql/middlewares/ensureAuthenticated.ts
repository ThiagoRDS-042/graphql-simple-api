import { MiddlewareFn } from "type-graphql";

import { AppError } from "@shared/errors/app-error";
import { cookieParser } from "@shared/utils/cokkie-parser";
import { validateToken } from "@shared/utils/validate-token";

import { CookieConfig } from "@config/cookie-config";
import { RoleType } from "@modules/users/entities/user-entity";
import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/prisma-users-repository";

import { IContext } from "../context";

interface IUser {
  userId: string;
  userRole: RoleType;
}

interface IContextMiddleware extends IContext {
  user: IUser;
}

export const ensureAuthenticated: MiddlewareFn<IContextMiddleware> = async (
  { context },
  next,
) => {
  const { cookie } = context.req.headers;

  if (!cookie) {
    throw new AppError("Cookie must be not found", "COOKIE_NOT_FOUND", 401);
  }

  const { key } = CookieConfig.newCookieConfig();

  const { [key]: accessToken } = cookieParser(cookie);

  if (!accessToken) {
    throw new AppError("Token must be not found", "TOKEN_NOT_FOUND", 401);
  }

  const { userId } = validateToken(accessToken);

  const prismaUsersRepository = new PrismaUsersRepository();

  const user = await prismaUsersRepository.findById(userId);

  if (!user) {
    throw new AppError("Invalid user", "INVALID_USER", 401);
  }

  context.user = {
    userId: user.id,
    userRole: user.role,
  };

  return next();
};
