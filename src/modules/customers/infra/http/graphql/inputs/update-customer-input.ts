import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateCustomerInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String)
  customerId: string;

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
