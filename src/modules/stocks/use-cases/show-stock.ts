import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/app-error";

import { Stock } from "../entities/stock-entity";
import { IStocksRepository } from "../repositories/interfaces/stocks-repository";

interface IShowStockParams {
  productId: string;
}

interface IShowStockResponse {
  stock: Stock;
}

@injectable()
export class ShowStock {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,
  ) {}

  public async execute(data: IShowStockParams): Promise<IShowStockResponse> {
    const { productId } = data;

    const stock = await this.stocksRepository.findByProductId(productId);

    if (stock === null) {
      throw new AppError("Stock does not exist", "STOCK_NOT_FOUND", 404);
    }

    return { stock };
  }
}
