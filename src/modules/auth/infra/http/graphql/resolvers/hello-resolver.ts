import { Query, Resolver } from "type-graphql";

@Resolver(() => String)
export class HelloResolver {
  @Query(() => String)
  hello() {
    return "Hello";
  }
}
