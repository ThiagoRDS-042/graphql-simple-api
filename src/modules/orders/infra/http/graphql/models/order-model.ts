import { Field, ID, ObjectType } from "type-graphql";

import { ProductModel } from "@modules/products/infra/http/graphql/models/product-model";
import { UserModel } from "@modules/users/infra/http/graphql/models/user-model";

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id: string;

  productId: string;

  @Field(() => ProductModel)
  product: ProductModel;

  sellerId: string;

  @Field(() => UserModel)
  seller: UserModel;

  customerId: string;

  @Field(() => UserModel)
  customer: UserModel;

  @Field(() => Number)
  amount: number;

  @Field(() => Number)
  price: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  canceledAt?: Date | null;
}
