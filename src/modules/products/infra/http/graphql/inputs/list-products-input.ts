import { IsOptional } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

import { ProductCategory } from "../models/product-model";

@InputType()
export class ListProductsInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  nameContains?: string | null;

  @IsOptional()
  @Field(() => ProductCategory, { nullable: true })
  categoryEquals?: ProductCategory | null;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  userIdEquals?: string | null;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  priceLte?: number | null;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  priceGte?: number | null;
}
