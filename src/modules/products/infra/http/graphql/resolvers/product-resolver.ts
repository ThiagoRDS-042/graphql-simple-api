import { container } from "tsyringe";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import {
  CurrentUser,
  ICurrentUser,
} from "@shared/infra/http/graphql/decorators/current-user";
import { ensureAuthenticated } from "@shared/infra/http/graphql/middleware/ensureAuthenticated";
import { ensureHasRole } from "@shared/infra/http/graphql/middleware/ensureHasRole";

import {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  ListProducts,
  ShowProduct,
} from "@modules/products/use-cases";

import {
  IProductViewModelResponse,
  ProductViewModel,
} from "../../view-models/product-view-model";
import {
  CreateProductInput,
  UpdateProductInput,
  ListProductsInput,
} from "../inputs";
import { ProductModel } from "../models/product-model";

@Resolver(() => ProductModel)
export class ProductResolver {
  @UseMiddleware(ensureAuthenticated)
  @UseMiddleware(ensureHasRole(["SELLER"]))
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

  @UseMiddleware(ensureAuthenticated)
  @UseMiddleware(ensureHasRole(["SELLER"]))
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

  @UseMiddleware(ensureAuthenticated)
  @UseMiddleware(ensureHasRole(["SELLER"]))
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
    @Arg("listProductsInput") input: ListProductsInput,
  ): Promise<IProductViewModelResponse[]> {
    const { categoryEquals, nameContains, priceGte, priceLte, userIdEquals } =
      input;

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
}
