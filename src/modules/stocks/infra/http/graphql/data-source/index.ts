import DataLoader from "dataloader";

import { prisma } from "@shared/infra/database/prisma/prisma-client";
import { BaseDataSource } from "@shared/utils/base-data-source";

import { Stock } from "@modules/stocks/entities/stock-entity";
import { PrismaStockMapper } from "@modules/stocks/infra/prisma/mappers/prisma-stock-mapper";
import { PrismaClient } from "@prisma/client";

export class StockDataSource extends BaseDataSource {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = prisma;
  }

  async getByProductId(productId: string): Promise<Stock> {
    return this.getByProductIdLoader.load(productId);
  }

  private getByProductIdLoader = new DataLoader(
    async (productIds: string[]) => {
      const stocks = await this.prisma.stock.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
      });

      return productIds.map(productId => {
        const stock = stocks.find(stock => stock.productId === productId);

        if (!stock) {
          return null;
        }

        return PrismaStockMapper.toDomain(stock);
      });
    },
  );
}
