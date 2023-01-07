import { AppError } from "@shared/errors/app-error";

export class Password {
  private readonly password: string;

  constructor(password: string, isEncrypted = false) {
    if (!isEncrypted) {
      const isPasswordStrong = this.validatePasswordStrong(password);

      if (!isPasswordStrong) {
        throw new AppError(
          "Password does not strong",
          "PASSWORD_NOT_STRONG",
          400,
        );
      }
    }

    this.password = password;
  }

  private validatePasswordStrong(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._@-]).{6,24}$/.test(
      password,
    );
  }

  public get value(): string {
    return this.password;
  }

  public static newPassword(password: string, isEncrypted = false): Password {
    const instancePassword = new Password(password, isEncrypted);

    return instancePassword;
  }
}
