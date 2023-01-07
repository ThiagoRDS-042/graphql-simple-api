import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Field, InputType, registerEnumType } from "type-graphql";

export enum UserRoleInput {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
}

registerEnumType(UserRoleInput, {
  name: "UserRoleInput",
  description: "Available user roles on input",
});

@InputType()
export class CreateUserInput {
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

  @IsString()
  @IsNotEmpty()
  @Field(() => UserRoleInput)
  role: UserRoleInput;

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
