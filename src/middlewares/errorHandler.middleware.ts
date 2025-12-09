export class CustomError extends Error {
  statusCode: number;
  success: boolean;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.success = false;

    Error.captureStackTrace(this, CustomError);
  }
}
