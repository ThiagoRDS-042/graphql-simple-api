import { container } from "tsyringe";

import { IUsersRepository } from "@modules/users/repositories/interfaces/users-repository";

import { PrismaUsersRepository } from "../infra/prisma/repositories/prisma-users-repository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository,
);
