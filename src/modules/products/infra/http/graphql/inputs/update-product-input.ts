import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Field, ID, InputType } from "type-graphql";

import { ProductCategory } from "../models/product-model";

@InputType()
export class UpdateProductInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => ID)
  productId: string;

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
