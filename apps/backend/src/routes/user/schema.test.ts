import { describe, expect, it } from "vitest";
import { userDetailsQuerySchema } from "./schema";

describe("userDetailsQuerySchema の userIds 解析", () => {
  it("カンマ結合の単一クエリ文字列を配列に分割する", () => {
    const result = userDetailsQuerySchema.parse({ userIds: "user_a,user_b" });

    expect(result.userIds).toEqual(["user_a", "user_b"]);
  });

  it("単一値を1要素の配列に正規化する", () => {
    const result = userDetailsQuerySchema.parse({ userIds: "user_solo" });

    expect(result.userIds).toEqual(["user_solo"]);
  });

  it("繰り返しクエリ由来の配列はそのまま受け入れる", () => {
    const result = userDetailsQuerySchema.parse({
      userIds: ["user_a", "user_b"],
    });

    expect(result.userIds).toEqual(["user_a", "user_b"]);
  });
});
