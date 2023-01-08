import { container } from "tsyringe";

import { PrismaProductsRepository } from "../infra/prisma/repositories/prisma-porducts-repository";
import { IProductsRepository } from "../repositories/products-repository";

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  PrismaProductsRepository,
);
