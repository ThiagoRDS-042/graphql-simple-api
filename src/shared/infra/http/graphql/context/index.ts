import { Request, Response } from "express";

import { IDataSources } from "../data-source";

export interface IContext {
  req: Request;
  res: Response;
  dataSources: IDataSources;
}

export const context = (context: IContext): IContext => {
  return context;
};
