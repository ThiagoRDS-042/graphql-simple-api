import { Request, Response } from "express";

interface IContextParams {
  req: Request;
  res: Response;
}

interface IContextResponse {
  authorization: string;
}

export const context = ({ req }: IContextParams): IContextResponse => {
  let { authorization } = req.headers;

  if (!authorization) {
    authorization = "";
  }

  return { authorization };
};
