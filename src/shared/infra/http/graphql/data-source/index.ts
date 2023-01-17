import { DataSources } from "apollo-server-core/dist/graphqlOptions";

import { OrderDataSource } from "@modules/orders/infra/http/graphql/data-source";
import { ProductDataSource } from "@modules/products/infra/http/graphql/data-source";
import { StockDataSource } from "@modules/stocks/infra/http/graphql/data-source";
import { UserDataSource } from "@modules/users/infra/http/graphql/data-source";

export interface IDataSources {
  userDataSource: UserDataSource;
  productDataSource: ProductDataSource;
  stockDataSource: StockDataSource;
  orderDataSource: OrderDataSource;
}

export const dataSources = (): DataSources<IDataSources> => {
  return {
    userDataSource: new UserDataSource(),
    productDataSource: new ProductDataSource(),
    stockDataSource: new StockDataSource(),
    orderDataSource: new OrderDataSource(),
  };
};
