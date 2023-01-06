import { container } from "tsyringe";

import { PrismaCustomersRepository } from "../http/infra/prisma/repositories/prisma-customers-repository";
import { ICustomersRepository } from "../repositories/customers-repository";

container.registerSingleton<ICustomersRepository>(
  "CustomersRepository",
  PrismaCustomersRepository,
);
