import { describe, expect, it } from "vitest";
import {
  指定されたガラスの形を読む,
  指定された描画方式を読む,
  描画方式の表示名を求める,
  描画方式を決める,
} from "./render-mode";

describe("指定された描画方式を読む", () => {
  it("URL で WebGL2 を指定すると WebGL2 を返す", () => {
    const mode = 指定された描画方式を読む("?renderer=webgl2");

    expect(mode).toBe("webgl2");
  });

  it("URL に指定が無いときは指定なしとして扱う", () => {
    const mode = 指定された描画方式を読む("");

    expect(mode).toBeNull();
  });

  it("知らない描画方式は指定なしとして扱う", () => {
    const mode = 指定された描画方式を読む("?renderer=canvas2d");

    expect(mode).toBeNull();
  });
});

describe("指定されたガラスの形を読む", () => {
  it("URL に指定が無いときは雫を返す", () => {
    const variant = 指定されたガラスの形を読む("");

    expect(variant).toBe("drop");
  });

  it("URL で ring を指定すると円環を返す", () => {
    const variant = 指定されたガラスの形を読む("?variant=ring");

    expect(variant).toBe("ring");
  });

  it("知らない形は雫として扱う", () => {
    const variant = 指定されたガラスの形を読む("?variant=cube");

    expect(variant).toBe("drop");
  });
});

describe("描画方式を決める", () => {
  it("横長の広い画面では雫を描く", () => {
    const mode = 描画方式を決める({ forcedMode: null, isWideScreen: true });

    expect(mode).toBe("webgl2");
  });

  it("スマホ幅や縦長の画面では写真だけにする", () => {
    const mode = 描画方式を決める({ forcedMode: null, isWideScreen: false });

    expect(mode).toBe("photo");
  });

  it("スマホ幅では雫を描く指定があっても写真だけにする", () => {
    const mode = 描画方式を決める({
      forcedMode: "webgl2",
      isWideScreen: false,
    });

    expect(mode).toBe("photo");
  });

  it("広い画面で静止画を指定すると静止画にする", () => {
    const mode = 描画方式を決める({ forcedMode: "static", isWideScreen: true });

    expect(mode).toBe("static");
  });
});

describe("描画方式の表示名を求める", () => {
  it("静止画は日本語の名前で表示する", () => {
    const label = 描画方式の表示名を求める("static");

    expect(label).toBe("静止画");
  });
});
