import { container } from "tsyringe";

import { PrismaCustomersRepository } from "../infra/prisma/repositories/prisma-customers-repository";
import { ICustomersRepository } from "../repositories/customers-repository";

container.registerSingleton<ICustomersRepository>(
  "CustomersRepository",
  PrismaCustomersRepository,
);
