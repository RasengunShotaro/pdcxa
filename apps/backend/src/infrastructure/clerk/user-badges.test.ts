import { describe, expect, it } from "vitest";
import { 公開メタデータからバッジを取り出す } from "./user-badges";

describe("公開メタデータからバッジを取り出す", () => {
  it("管理者が付けたバッジをそのまま返す", () => {
    const publicMetadata = { badges: ["originator"] };

    const result = 公開メタデータからバッジを取り出す(publicMetadata);

    expect(result).toEqual(["originator"]);
  });

  it("バッジが設定されていないユーザーには何も付けない", () => {
    const publicMetadata = {};

    const result = 公開メタデータからバッジを取り出す(publicMetadata);

    expect(result).toEqual([]);
  });

  it("バッジが配列でなく書かれていたら何も付けない", () => {
    const publicMetadata = { badges: "originator" };

    const result = 公開メタデータからバッジを取り出す(publicMetadata);

    expect(result).toEqual([]);
  });

  it("文字列でないバッジは読み飛ばす", () => {
    const publicMetadata = { badges: ["originator", 1, null, { id: "x" }] };

    const result = 公開メタデータからバッジを取り出す(publicMetadata);

    expect(result).toEqual(["originator"]);
  });

  it("メタデータ自体が無いユーザーには何も付けない", () => {
    const result = 公開メタデータからバッジを取り出す(null);

    expect(result).toEqual([]);
  });
});
