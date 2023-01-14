import { Field, ID, ObjectType } from "type-graphql";

import { ProductModel } from "@modules/products/infra/http/graphql/models/product-model";

@ObjectType()
export class StockModel {
  @Field(() => ID)
  id: string;

  productId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => ProductModel)
  product: ProductModel;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;
}
