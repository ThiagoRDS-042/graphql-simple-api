import { IsOptional } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ListOrdersInput {
  @IsOptional()
  @Field(() => ID, { nullable: true })
  productIdEquals?: string | null;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  customerIdEquals?: string | null;

  @IsOptional()
  @Field(() => ID, { nullable: true })
  sellerIdEquals?: string | null;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isCanceled?: boolean | null;
}
