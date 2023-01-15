import { prisma } from "@shared/infra/database/prisma/prisma-client";

import { IFindMany } from "@modules/stocks/dtos/find-many";
import { Stock } from "@modules/stocks/entities/stock-entity";
import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";

import { PrismaStockMapper } from "../mappers/prisma-stock-mapper";

export class PrismaStocksRepository implements IStocksRepository {
  public async create(stock: Stock): Promise<Stock> {
    const raw = PrismaStockMapper.toPrisma(stock);

    const stockCreated = await prisma.stock.create({
      data: raw,
    });

    return PrismaStockMapper.toDomain(stockCreated);
  }

  public async save(stock: Stock): Promise<Stock> {
    const raw = PrismaStockMapper.toPrisma(stock);

    const stockCreated = await prisma.stock.update({
      data: raw,
      where: { id: raw.id },
    });

    return PrismaStockMapper.toDomain(stockCreated);
  }

  public async findByProductId(productId: string): Promise<Stock | null> {
    const stock = await prisma.stock.findFirst({
      where: { productId: { equals: productId }, deletedAt: { equals: null } },
    });

    if (!stock) {
      return null;
    }

    return PrismaStockMapper.toDomain(stock);
  }

  public async findMany(options: IFindMany): Promise<Stock[]> {
    const { userIdEquals } = options;

    const stocks = await prisma.stock.findMany({
      where: {
        product: { userId: { equals: userIdEquals } },
        deletedAt: { equals: null },
      },
    });

    return stocks.map(PrismaStockMapper.toDomain);
  }
}
