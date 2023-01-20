import { container } from "tsyringe";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { IContext } from "@shared/infra/http/graphql/context";
import {
  CurrentUser,
  ICurrentUser,
} from "@shared/infra/http/graphql/decorators/current-user";
import { ensureAuthenticated } from "@shared/infra/http/graphql/middlewares/ensureAuthenticated";
import { ensureHasRole } from "@shared/infra/http/graphql/middlewares/ensureHasRole";

import { ProductModel } from "@modules/products/infra/http/graphql/models/product-model";
import {
  IProductViewModelResponse,
  ProductViewModel,
} from "@modules/products/infra/http/view-models/product-view-model";
import {
  CreateStock,
  UpdateStock,
  ListStocks,
  ShowStock,
} from "@modules/stocks/use-cases";

import {
  IStockViewModelResponse,
  StockViewModel,
} from "../../view-models/stock-view-model";
import { CreateStockInput, ShowStockInput, UpdateStockInput } from "../inputs";
import { StockModel } from "../models/stock-model";

@Resolver(() => StockModel)
export class StockResolver {
  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Mutation(() => StockModel)
  async createStock(
    @Arg("createStockInput") input: CreateStockInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IStockViewModelResponse> {
    const { amount, productId } = input;
    const { userId } = currentUser;

    const createStock = container.resolve(CreateStock);

    const { stock } = await createStock.execute({
      amount,
      productId,
      userId,
    });

    return StockViewModel.toHTTP(stock);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Mutation(() => StockModel)
  async updateStock(
    @Arg("updateStockInput") input: UpdateStockInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IStockViewModelResponse> {
    const { amount, productId } = input;
    const { userId } = currentUser;

    const updateStock = container.resolve(UpdateStock);

    const { stock } = await updateStock.execute({
      amount,
      productId,
      userId,
    });

    return StockViewModel.toHTTP(stock);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Query(() => [StockModel])
  async listStocks(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IStockViewModelResponse[]> {
    const { userId } = currentUser;

    const listStocks = container.resolve(ListStocks);

    const { stocks } = await listStocks.execute({
      userIdEquals: userId,
    });

    return stocks.map(StockViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Query(() => StockModel)
  async showStockByProductId(
    @Arg("showStockInput") input: ShowStockInput,
  ): Promise<IStockViewModelResponse> {
    const { productId } = input;

    const showStock = container.resolve(ShowStock);

    const { stock } = await showStock.execute({
      productId,
    });

    return StockViewModel.toHTTP(stock);
  }

  @FieldResolver(() => ProductModel)
  async product(
    @Root() stockModel: StockModel,
    @Ctx() context: IContext,
  ): Promise<IProductViewModelResponse> {
    const { productId } = stockModel;
    const { productDataSource } = context.dataSources;

    const product = await productDataSource.getById(productId);

    return ProductViewModel.toHTTP(product);
  }
}
