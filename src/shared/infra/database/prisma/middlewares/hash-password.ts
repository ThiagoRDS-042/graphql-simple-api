import { hash } from "bcryptjs";

import { Prisma } from "@prisma/client";

export const hashPassword: Prisma.Middleware = async (params, next) => {
  if (params.model === "Customer") {
    if (params.action === "create" || params.action === "update") {
      if (params.args.data.password) {
        const hashPass = await hash(params.args.data.password, 10);
        params.args.data.password = hashPass;
      }
    }
  }
  return next(params);
};
