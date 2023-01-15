import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  productId: string;

  @Field(() => ID)
  sellerId: string;

  @Field(() => ID)
  customerId: string;

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
