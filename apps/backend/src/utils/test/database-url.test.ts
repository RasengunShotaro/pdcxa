import { afterEach, describe, expect, it, vi } from "vitest";
import { テスト用データベースURL } from "./database-url";

describe("テスト用データベースURL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("localhost の URL はそのまま返す", () => {
    vi.stubEnv("DATABASE_URL", "postgres://test:test@localhost:5432/test");

    expect(テスト用データベースURL()).toBe(
      "postgres://test:test@localhost:5432/test",
    );
  });

  it("127.0.0.1 の URL も許可する", () => {
    vi.stubEnv("DATABASE_URL", "postgres://test:test@127.0.0.1:5432/test");

    expect(テスト用データベースURL()).toBe(
      "postgres://test:test@127.0.0.1:5432/test",
    );
  });

  it("localhost 以外のホストは実 DB 破壊防止のため拒否する", () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgres://user:pw@ep-prod.ap-southeast-1.aws.neon.tech:5432/main",
    );

    expect(() => テスト用データベースURL()).toThrow(/localhost のみ許可/);
  });

  it("未設定ならローカル既定 URL にフォールバックする", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(テスト用データベースURL()).toBe(
      "postgres://test:test@localhost:5432/test",
    );
  });
});
