import { IsNotEmpty, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ActiveProductInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => ID)
  productId: string;
}
