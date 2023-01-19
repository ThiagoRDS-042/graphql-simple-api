import { hash } from "bcryptjs";

import { Prisma } from "@prisma/client";

export const hashPassword: Prisma.Middleware = async (params, next) => {
  if (params.model === "User") {
    if (params.action === "create" || params.action === "update") {
      if (params.args.data.password && params.args.data.password.length < 24) {
        const hashPass = await hash(params.args.data.password, 10);
        params.args.data.password = hashPass;
      }
    }
  }
  return next(params);
};
