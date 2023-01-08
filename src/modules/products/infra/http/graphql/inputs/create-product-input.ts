import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

import { ProductCategory } from "../models/product-model";

@InputType()
export class CreateProductInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string | null;

  @IsString()
  @IsNotEmpty()
  @Field(() => ProductCategory)
  category: ProductCategory;
}
