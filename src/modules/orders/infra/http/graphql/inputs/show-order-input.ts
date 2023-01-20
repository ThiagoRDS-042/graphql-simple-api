import { IsNotEmpty, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ShowOrderInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => ID)
  orderId: string;
}
