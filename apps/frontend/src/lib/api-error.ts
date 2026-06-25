export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`API request failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getApiErrorStatus = (error: unknown): number | null => {
  if (error instanceof ApiError) {
    return error.status;
  }
  return null;
};
