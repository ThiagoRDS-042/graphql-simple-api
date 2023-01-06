import { IsOptional } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class ListCustomersInput {
  @IsOptional()
  @Field(() => String)
  nameContains?: string;

  @IsOptional()
  @Field(() => String)
  emailContains?: string;
}
