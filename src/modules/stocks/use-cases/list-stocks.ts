import { inject, injectable } from "tsyringe";

import { Stock } from "../entities/stock-entity";
import { IStocksRepository } from "../repositories/stocks-repository";

interface IListStocksParams {
  userIdEquals?: string;
}

interface IListStocksResponse {
  stocks: Stock[];
}

@injectable()
export class ListStocks {
  constructor(
    @inject("StocksRepository")
    private readonly stocksRepository: IStocksRepository,
  ) {}

  public async execute(data: IListStocksParams): Promise<IListStocksResponse> {
    const { userIdEquals } = data;

    const stocks = await this.stocksRepository.findMany({ userIdEquals });

    return { stocks };
  }
}
