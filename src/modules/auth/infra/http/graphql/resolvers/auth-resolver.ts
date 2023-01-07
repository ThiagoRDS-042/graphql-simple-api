import { container } from "tsyringe";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { IContext } from "@shared/infra/http/context";

import { CookieConfig } from "@config/cookie-config";
import { Auth } from "@modules/auth/use-cases/auth";

import { AuthInput } from "../inputs";

@Resolver(() => Boolean)
export class AuthResolver {
  @Mutation(() => Boolean)
  async auth(
    @Arg("authInput") input: AuthInput,
    @Ctx() context: IContext,
  ): Promise<boolean> {
    const { email, password } = input;

    const auth = container.resolve(Auth);

    const { accessToken } = await auth.execute({
      email,
      password,
    });

    const { res } = context;

    const { key, options } = CookieConfig.newCookieConfig();

    res.cookie(key, accessToken, options);

    return true;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() context: IContext): boolean {
    const { res } = context;

    const { key } = CookieConfig.newCookieConfig();

    res.clearCookie(key);

    return true;
  }
}
