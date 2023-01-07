import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

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

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
