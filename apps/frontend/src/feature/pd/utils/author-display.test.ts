import { describe, expect, test } from "vitest";
import { 著者の名前を決める } from "./author-display";

describe("著者の名前を決める", () => {
  test("名前があれば名前とハンドルを並べる", () => {
    expect(
      著者の名前を決める({ userFullName: "山田 太郎", userName: "taro" }),
    ).toEqual({
      name: "山田 太郎",
      handle: "taro",
    });
  });

  test("名前が空ならハンドルを名前として出し、ハンドルを重ねない", () => {
    expect(著者の名前を決める({ userFullName: " ", userName: "taro" })).toEqual(
      {
        name: "@taro",
        handle: null,
      },
    );
  });

  test("名前もハンドルも無ければ名称未設定と出す", () => {
    expect(著者の名前を決める({ userFullName: "", userName: "" })).toEqual({
      name: "名称未設定",
      handle: null,
    });
  });
});
