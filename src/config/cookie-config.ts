import { BaseConfig } from "@shared/utils/base-config";

type SameSiteType = "strict" | "none" | "lax";

interface ICookieOptions {
  httpOnly: boolean;
  path: string;
  sameSite: SameSiteType;
  secure: boolean;
  maxAge: number;
}

interface ICookieConfigProps {
  key: string;
  options: ICookieOptions;
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 60 * 24 * 1;

const cookieConfig: ICookieConfigProps = {
  key: "accessToken",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: true,
    maxAge: ONE_DAY_IN_SECONDS,
  },
};

export class CookieConfig extends BaseConfig<ICookieConfigProps> {
  constructor() {
    super(cookieConfig);
  }

  public get key(): string {
    return this.props.key;
  }

  public set key(key: string) {
    this.props.key = key;
  }

  public get options(): ICookieOptions {
    return this.props.options;
  }

  public set options(options: ICookieOptions) {
    this.props.options = options;
  }

  public static newCookieConfig(): CookieConfig {
    return new CookieConfig();
  }
}
