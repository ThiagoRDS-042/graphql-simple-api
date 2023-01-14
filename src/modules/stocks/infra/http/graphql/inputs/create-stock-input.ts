import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class CreateStockInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => ID)
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Number)
  amount: number;
}
