import { createParamDecorator } from "type-graphql";

import { RoleType } from "@modules/users/entities/user-entity";

export type ICurrentUser = {
  userName: string;
  userId: string;
  userRole: RoleType;
};

interface IContext {
  user: ICurrentUser;
}

export const CurrentUser = () => {
  return createParamDecorator<IContext>(({ context }) => context.user);
};
