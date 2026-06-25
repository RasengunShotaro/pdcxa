import { getApiErrorStatus } from "./api-error";

export type ErrorKind = "retryable" | "fatal" | "auth";

export interface ErrorDisplay {
  kind: ErrorKind;
  message: string;
}

const RETRYABLE_MESSAGE = "通信に失敗しました。再試行してください";
const FATAL_MESSAGE = "予期しないエラーが発生しました";
const AUTH_MESSAGE = "ログインが必要です";

export const errorDisplayForStatus = (status: number | null): ErrorDisplay => {
  if (status === 401) {
    return { kind: "auth", message: AUTH_MESSAGE };
  }
  if (status === null || status >= 500) {
    return { kind: "retryable", message: RETRYABLE_MESSAGE };
  }
  return { kind: "fatal", message: FATAL_MESSAGE };
};

export const errorDisplay = (error: unknown): ErrorDisplay =>
  errorDisplayForStatus(getApiErrorStatus(error));
