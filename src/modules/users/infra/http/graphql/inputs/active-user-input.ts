import { IsEmail, IsNotEmpty } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class ActiveUserInput {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;
}
