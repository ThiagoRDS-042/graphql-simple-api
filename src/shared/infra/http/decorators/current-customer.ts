import { createParamDecorator } from "type-graphql";

export type ICurrentCustomer = {
  customerName: string;
  customerId: string;
};

interface IContext {
  customer: ICurrentCustomer;
}

export const CurrentCustomer = () => {
  return createParamDecorator<IContext>(({ context }) => context.customer);
};
