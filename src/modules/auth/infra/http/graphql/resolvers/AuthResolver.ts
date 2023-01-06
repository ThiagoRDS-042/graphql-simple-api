import { Mutation, Resolver } from "type-graphql";

@Resolver(() => String)
export class AuthResolver {
  @Mutation(() => String)
  auth() {
    return "test";
  }
}
