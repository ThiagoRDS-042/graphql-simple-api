import { IFindMany } from "../../dtos/find-many";
import { Stock } from "../../entities/stock-entity";

export interface IStocksRepository {
  create(stock: Stock): Promise<Stock>;
  save(stock: Stock): Promise<Stock>;
  findByProductId(productId: string): Promise<Stock | null>;
  findMany(options: IFindMany): Promise<Stock[]>;
}
