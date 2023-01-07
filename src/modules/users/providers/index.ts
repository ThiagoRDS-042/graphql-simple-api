import { container } from "tsyringe";

import { PrismaUsersRepository } from "../infra/prisma/repositories/prisma-users-repository";
import { IUsersRepository } from "../repositories/users-repository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository,
);
