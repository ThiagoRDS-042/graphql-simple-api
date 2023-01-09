import { IStockProps, Stock } from "@modules/stocks/entities/stock-entity";

type Override = Partial<IStockProps>;

export const makeStock = (override: Override = {}): Stock => {
  return Stock.newStock({
    amount: 12,
    productId: "example-user-id",
    ...override,
  });
};
