import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { OrderModel } from "@modules/orders/infra/http/graphql/models/order-model";
import { StockModel } from "@modules/stocks/infra/http/graphql/models/stock-model";
import { UserModel } from "@modules/users/infra/http/graphql/models/user-model";

export enum ProductCategory {
  ELECTRONICS = "ELECTRONICS",
  BOOKS = "BOOKS",
  SPORTS = "SPORTS",
  GAMES = "GAMES",
  FASHION = "FASHION",
}

registerEnumType(ProductCategory, {
  name: "ProductCategory",
  description: "Available products categories",
});

@ObjectType()
export class ProductModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Number)
  price: number;

  @Field(() => ProductCategory)
  category: ProductCategory;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => StockModel, { nullable: true })
  stock: StockModel;

  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;

  @Field(() => [OrderModel])
  orders: OrderModel[];
}
