import { Product } from "@modules/products/entities/product-entity";
import { IFindMany } from "@modules/stocks/dtos/find-many";
import { Stock } from "@modules/stocks/entities/stock-entity";
import { IStocksRepository } from "@modules/stocks/repositories/interfaces/stocks-repository";

export interface IStock extends Stock {
  product?: Product;
}

export class InMemoryStocksRepository implements IStocksRepository {
  public stocks: IStock[] = [];

  public async create(stock: Stock): Promise<Stock> {
    this.stocks.push(stock);

    return stock;
  }

  public async save(stock: Stock): Promise<Stock> {
    const stockIndex = this.stocks.findIndex(item => item.id === stock.id);

    if (stockIndex >= 0) {
      this.stocks[stockIndex] = stock;
    }

    return stock;
  }

  public async findByProductId(productId: string): Promise<Stock | null> {
    const stock = this.stocks.find(
      item => item.productId === productId && !item.deletedAt,
    );

    if (!stock) {
      return null;
    }

    return stock;
  }

  public async findMany(options: IFindMany): Promise<Stock[]> {
    const { userIdEquals } = options;

    const stocks = this.stocks.filter(
      item => item.product.userId === userIdEquals && !item.deletedAt,
    );

    return stocks;
  }
}
