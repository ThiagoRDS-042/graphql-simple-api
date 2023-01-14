import { container } from "tsyringe";

import { PrismaStocksRepository } from "../infra/prisma/repositories/prisma-stocks-repository";
import { IStocksRepository } from "../repositories/interfaces/stocks-repository";

container.registerSingleton<IStocksRepository>(
  "StocksRepository",
  PrismaStocksRepository,
);
