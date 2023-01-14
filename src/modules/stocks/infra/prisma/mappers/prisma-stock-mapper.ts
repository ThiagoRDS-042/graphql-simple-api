import { Stock } from "@modules/stocks/entities/stock-entity";

interface IRawStock {
  id: string;
  amount: number;
  productId: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export class PrismaStockMapper {
  public static toPrisma(stock: Stock): IRawStock {
    return {
      id: stock.id,
      amount: stock.amount,
      productId: stock.productId,
      createdAt: stock.createdAt,
      deletedAt: stock.deletedAt,
      updatedAt: stock.updatedAt,
    };
  }

  public static toDomain(raw: IRawStock): Stock {
    return Stock.newStock(
      {
        amount: raw.amount,
        productId: raw.productId,
        createdAt: raw.createdAt,
        deletedAt: raw.deletedAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
