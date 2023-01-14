import { Stock } from "@modules/stocks/entities/stock-entity";

export interface IStockViewModelResponse {
  id: string;
  amount: number;
  productId: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export class StockViewModel {
  static toHTTP(stock: Stock): IStockViewModelResponse {
    return {
      id: stock.id,
      amount: stock.amount,
      productId: stock.productId,
      createdAt: stock.createdAt,
      deletedAt: stock.deletedAt,
      updatedAt: stock.updatedAt,
    };
  }
}
