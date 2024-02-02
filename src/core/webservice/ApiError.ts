export class ApiError extends Error {
  public errorCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.errorCode = statusCode;
  }
}
