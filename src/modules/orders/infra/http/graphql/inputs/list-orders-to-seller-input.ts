import { IsOptional } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ListOrdersToSellerInput {
  @IsOptional()
  @Field(() => ID, { nullable: true })
  productIdEquals?: string | null;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  customerIdEquals?: string | null;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isCanceled?: boolean | null;
}
