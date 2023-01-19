import { IsNotEmpty, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class DeleteProductInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => ID)
  productId: string;
}
