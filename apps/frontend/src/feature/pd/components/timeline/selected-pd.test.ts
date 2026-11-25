import { describe, expect, it } from "vitest";
import { 選択中のPDを決める } from "./selected-pd";

describe("選択中のPDを決める", () => {
  it("PD を開いているときは開いている PD を選択中にする", () => {
    const selected = 選択中のPDを決める({
      pathname: "/pd/pd-2",
      firstPdId: "pd-1",
    });

    expect(selected).toBe("pd-2");
  });

  it("一覧だけを見ているときは先頭の PD を選択中にする", () => {
    const selected = 選択中のPDを決める({ pathname: "/", firstPdId: "pd-1" });

    expect(selected).toBe("pd-1");
  });

  it("一覧と詳細を並べない画面ではどの PD も選択中にしない", () => {
    const selected = 選択中のPDを決める({
      pathname: "/user/taro",
      firstPdId: "pd-1",
    });

    expect(selected).toBeUndefined();
  });
});
