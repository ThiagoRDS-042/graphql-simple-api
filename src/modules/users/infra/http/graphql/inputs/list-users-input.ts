import { IsOptional } from "class-validator";
import { Field, InputType } from "type-graphql";

import { UserRoleInput } from "./create-user-input";

@InputType()
export class ListUsersInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  nameContains?: string | null;

  @IsOptional()
  @Field(() => String, { nullable: true })
  emailContains?: string | null;

  @IsOptional()
  @Field(() => UserRoleInput, { nullable: true })
  roleEquals?: UserRoleInput | null;
}
