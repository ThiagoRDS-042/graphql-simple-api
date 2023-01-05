import { BaseConfig } from "@shared/utils/base-config";

interface CookieConfigProps {
  key: string;
}

const cookieConfig: CookieConfigProps = {
  key: "accessToken",
};

export class CookieConfig extends BaseConfig<CookieConfigProps> {
  constructor() {
    super(cookieConfig);
  }

  public get key(): string {
    return this.props.key;
  }

  public set key(key: string) {
    this.props.key = key;
  }

  public static newCookieConfig(): CookieConfig {
    return new CookieConfig();
  }
}
