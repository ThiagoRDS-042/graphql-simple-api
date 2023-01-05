import { BaseConfig } from "@shared/utils/base-config";

interface CacheConfigProps {
  name: string;
  value: string;
}

type IType = "public" | "private" | "no-cache" | "no-store";

interface ISetValue {
  type: IType;
  seconds: number;
}

const SECONDS = 60 * 1;
const TYPE: IType = "private";

const cacheConfig: CacheConfigProps = {
  name: "Cache-control",
  value: `${TYPE}, max-age=${SECONDS}`,
};

export class CacheConfig extends BaseConfig<CacheConfigProps> {
  constructor() {
    super(cacheConfig);
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get value(): string {
    return this.props.value;
  }

  public setValue({ seconds, type }: ISetValue) {
    this.props.value = `${type}, max-age=${seconds}`;
  }

  public static newCacheConfig(): CacheConfig {
    return new CacheConfig();
  }
}
