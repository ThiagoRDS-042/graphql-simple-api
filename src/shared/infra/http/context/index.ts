import { Request, Response } from "express";

export interface IContext {
  req: Request;
  res: Response;
}

export const context = (context: IContext): IContext => {
  return context;
};
