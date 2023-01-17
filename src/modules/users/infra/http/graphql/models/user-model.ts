import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { OrderModel } from "@modules/orders/infra/http/graphql/models/order-model";
import { ProductModel } from "@modules/products/infra/http/graphql/models/product-model";

enum UserRoleModel {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
}

registerEnumType(UserRoleModel, {
  name: "UserRoleModel",
  description: "Available user roles on model",
});

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  document: string;

  @Field(() => UserRoleModel)
  role: UserRoleModel;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => [ProductModel])
  products: ProductModel[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date | null;

  @Field(() => [OrderModel])
  orders: OrderModel[];
}
