export interface AuthUser {
  readonly id: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly fullName: string | null;
  readonly imageUrl: string;
}

export type SignInResult = { error: unknown };

export interface SignInFlow {
  readonly status: string | null;
  password(params: {
    emailAddress: string;
    password: string;
  }): Promise<SignInResult>;
  create(params: { identifier: string }): Promise<SignInResult>;
  finalize(params: {
    navigate: (args: { decorateUrl: (url: string) => string }) => void;
  }): Promise<unknown>;
  readonly resetPasswordEmailCode: {
    sendCode(): Promise<SignInResult>;
    verifyCode(params: { code: string }): Promise<SignInResult>;
    submitPassword(params: { password: string }): Promise<SignInResult>;
  };
}
