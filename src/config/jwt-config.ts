import { BaseConfig } from "@shared/utils/base-config";

type AlgorithmType = "HS256" | "RS256";

interface JwtConfigProps {
  secretKey: string;
  algorithm: AlgorithmType;
  expiresIn: string | number;
}

const jwtConfig: JwtConfigProps = {
  secretKey: process.env.JWT_SECRET_KEY,
  algorithm: "HS256",
  expiresIn: "1h",
};

export class JwtConfig extends BaseConfig<JwtConfigProps> {
  constructor() {
    super(jwtConfig);
  }

  public set secretKey(secretKey: string) {
    this.props.secretKey = secretKey;
  }

  public get secretKey(): string {
    return this.props.secretKey;
  }

  public get algorithm(): AlgorithmType {
    return this.props.algorithm;
  }

  public set algorithm(algorithm: AlgorithmType) {
    this.props.algorithm = algorithm;
  }

  public get expiresIn(): string | number {
    return this.props.expiresIn;
  }

  public set expiresIn(expiresIn: string | number) {
    this.props.expiresIn = expiresIn;
  }

  public static newJwtConfig(): JwtConfig {
    return new JwtConfig();
  }
}
