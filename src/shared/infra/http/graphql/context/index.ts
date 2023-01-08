import { Request, Response } from "express";

import { ProductDataSource } from "@modules/products/infra/http/graphql/data-source";
import { UserDataSource } from "@modules/users/infra/http/graphql/data-source";

export interface IContext {
  req: Request;
  res: Response;
  dataSources: {
    userDataSource: UserDataSource;
    productDataSource: ProductDataSource;
  };
}

export const context = (context: IContext): IContext => {
  return context;
};
