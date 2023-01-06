import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCustomerInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 24)
  @Field(() => String)
  password: string;
}
