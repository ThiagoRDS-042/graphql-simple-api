import { MiddlewareFn } from "type-graphql";

import { AppError } from "@shared/errors/app-error";

import { RoleType } from "@modules/users/entities/user-entity";

import { IContext } from "../context";

interface IUser {
  userName: string;
  userId: string;
  userRole: RoleType;
}

export interface IContextMiddleware extends IContext {
  user: IUser;
}

export const ensureHasRole = (roles_names: RoleType[]) => {
  const verifyHasRoleRole: MiddlewareFn<IContextMiddleware> = async (
    { context },
    next,
  ) => {
    const { userRole } = context.user;

    const hasRole = roles_names.some(role_name => role_name === userRole);

    if (!hasRole) {
      throw new AppError("Forbidden", "FORBIDDEN", 403);
    }

    return next();
  };

  return verifyHasRoleRole;
};
