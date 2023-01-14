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

import {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  ListProducts,
  ShowProduct,
} from "@modules/products/use-cases";
import { StockModel } from "@modules/stocks/infra/http/graphql/models/stock-model";
import {
  IStockViewModelResponse,
  StockViewModel,
} from "@modules/stocks/infra/http/view-models/stock-view-model";
import { UserModel } from "@modules/users/infra/http/graphql/models/user-model";
import {
  IUserViewModelResponse,
  UserViewModel,
} from "@modules/users/infra/http/view-models/user-view-model";

import {
  IProductViewModelResponse,
  ProductViewModel,
} from "../../view-models/product-view-model";
import {
  CreateProductInput,
  UpdateProductInput,
  ListProductsInput,
} from "../inputs";
import { ProductCategory, ProductModel } from "../models/product-model";

@Resolver(() => ProductModel)
export class ProductResolver {
  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Mutation(() => ProductModel)
  async createProduct(
    @Arg("createProductInput") input: CreateProductInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IProductViewModelResponse> {
    const { category, name, price, description } = input;
    const { userId } = currentUser;

    const createProduct = container.resolve(CreateProduct);

    const { product } = await createProduct.execute({
      category,
      name,
      price,
      description,
      userId,
    });

    return ProductViewModel.toHTTP(product);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Mutation(() => ProductModel)
  async updateProduct(
    @Arg("updateProductInput") input: UpdateProductInput,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IProductViewModelResponse> {
    const { category, name, price, productId, description } = input;
    const { userId } = currentUser;

    const updateProduct = container.resolve(UpdateProduct);

    const { product } = await updateProduct.execute({
      category,
      name,
      price,
      productId,
      description,
      userId,
    });

    return ProductViewModel.toHTTP(product);
  }

  @UseMiddleware(ensureAuthenticated, ensureHasRole(["SELLER"]))
  @Mutation(() => Boolean)
  async deleteProduct(
    @Arg("productId") productId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<boolean> {
    const { userId } = currentUser;

    const deleteProduct = container.resolve(DeleteProduct);

    await deleteProduct.execute({ userId, productId });

    return true;
  }

  @UseMiddleware(ensureAuthenticated)
  @Query(() => [ProductModel])
  async listProducts(
    @Arg("listProductsInput", { nullable: true }) input: ListProductsInput,
  ): Promise<IProductViewModelResponse[]> {
    let categoryEquals: ProductCategory = undefined;
    let nameContains: string = undefined;
    let priceGte: number = undefined;
    let priceLte: number = undefined;
    let userIdEquals: string = undefined;

    if (input) {
      categoryEquals = input.categoryEquals;
      nameContains = input.nameContains;
      priceGte = input.priceGte;
      priceLte = input.priceLte;
      userIdEquals = input.userIdEquals;
    }

    const listProducts = container.resolve(ListProducts);

    const { products } = await listProducts.execute({
      categoryEquals,
      nameContains,
      priceGte,
      priceLte,
      userIdEquals,
    });

    return products.map(ProductViewModel.toHTTP);
  }

  @UseMiddleware(ensureAuthenticated)
  @Query(() => ProductModel)
  async showProduct(
    @Arg("productId") productId: string,
  ): Promise<IProductViewModelResponse> {
    const showProduct = container.resolve(ShowProduct);

    const { product } = await showProduct.execute({ productId });

    return ProductViewModel.toHTTP(product);
  }

  @FieldResolver(() => UserModel)
  async user(
    @Root() productModel: ProductModel,
    @Ctx() context: IContext,
  ): Promise<IUserViewModelResponse> {
    const { userDataSource } = context.dataSources;

    const { userId } = productModel;

    const user = await userDataSource.getById(userId);

    return UserViewModel.toHTTP(user);
  }

  @FieldResolver(() => StockModel)
  async stock(
    @Root() productModel: ProductModel,
    @Ctx() context: IContext,
  ): Promise<IStockViewModelResponse> {
    const { stockDataSource } = context.dataSources;

    const { id } = productModel;

    const stock = await stockDataSource.getByProductId(id);

    if (stock === null) {
      return stock;
    }

    return StockViewModel.toHTTP(stock);
  }
}
