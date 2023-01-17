import { container } from "tsyringe";

import { PrismaOrdersRepository } from "../infra/prisma/repositories/prisma-orders-repository";
import { IOrdersRepository } from "../repositories/interfaces/orders-repository";

container.registerSingleton<IOrdersRepository>(
  "OrdersRepository",
  PrismaOrdersRepository,
);
