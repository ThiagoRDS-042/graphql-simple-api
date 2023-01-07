import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(16)
  @Field(() => String)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 18)
  @Field(() => String)
  document: string;

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
