export class AppError extends Error {
  private readonly code: string;
  private readonly _statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this._statusCode = statusCode;
  }

  public getResponse() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this._statusCode,
    };
  }
}
