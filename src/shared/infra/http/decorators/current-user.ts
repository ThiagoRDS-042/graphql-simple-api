import { createParamDecorator } from "type-graphql";

export type ICurrentUser = {
  userName: string;
  userId: string;
};

interface IContext {
  user: ICurrentUser;
}

export const CurrentUser = () => {
  return createParamDecorator<IContext>(({ context }) => context.user);
};
