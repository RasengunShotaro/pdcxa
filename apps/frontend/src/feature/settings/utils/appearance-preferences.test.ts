import { describe, expect, it } from "vitest";
import {
  保存された表示の設定を読む,
  描く背景を決める,
  表示の設定で切り替える見た目,
  表示の設定を保存できる形にする,
} from "./appearance-preferences";

describe("保存された表示の設定を読む", () => {
  it("何も保存されていなければ、透明度も動きも減らさない", () => {
    const settings = 保存された表示の設定を読む(null);

    expect(settings).toEqual({
      reduceTransparency: false,
      reduceMotion: false,
      backdrop: "sky",
    });
  });

  it("保存した設定をそのまま戻す", () => {
    const settings = 保存された表示の設定を読む(
      '{"reduceTransparency":true,"reduceMotion":false}',
    );

    expect(settings).toMatchObject({
      reduceTransparency: true,
      reduceMotion: false,
    });
  });

  it("壊れた値が保存されていても、既定の設定で開ける", () => {
    const settings = 保存された表示の設定を読む("{not json");

    expect(settings).toEqual({
      reduceTransparency: false,
      reduceMotion: false,
      backdrop: "sky",
    });
  });

  it("真偽値でない項目は減らさない側に倒す", () => {
    const settings = 保存された表示の設定を読む(
      '{"reduceTransparency":"yes","reduceMotion":true}',
    );

    expect(settings).toMatchObject({
      reduceTransparency: false,
      reduceMotion: true,
    });
  });

  it("選んだ背景を戻す", () => {
    const settings = 保存された表示の設定を読む('{"backdrop":"plain"}');

    expect(settings.backdrop).toBe("plain");
  });

  it("背景を選ぶ前に保存した設定は、空の背景で開く", () => {
    const settings = 保存された表示の設定を読む(
      '{"reduceTransparency":true,"reduceMotion":false}',
    );

    expect(settings.backdrop).toBe("sky");
  });

  it("選べなくなった背景が保存されていたら、空の背景で開く", () => {
    const settings = 保存された表示の設定を読む('{"backdrop":"ribbon"}');

    expect(settings.backdrop).toBe("sky");
  });
});

describe("表示の設定を保存できる形にする", () => {
  it("保存した形を読み直すと同じ設定に戻る", () => {
    const saved = 表示の設定を保存できる形にする({
      reduceTransparency: true,
      reduceMotion: true,
      backdrop: "plain",
    });

    expect(保存された表示の設定を読む(saved)).toEqual({
      reduceTransparency: true,
      reduceMotion: true,
      backdrop: "plain",
    });
  });
});

describe("描く背景を決める", () => {
  it("用意できている背景を選んでいれば、その背景を描く", () => {
    const backdrop = 描く背景を決める({
      backdrop: "plain",
      available: ["sky", "plain"],
    });

    expect(backdrop).toBe("plain");
  });

  it("用意できていない背景を選んでいたら、空の背景を描く", () => {
    const backdrop = 描く背景を決める({
      backdrop: "plain",
      available: ["sky"],
    });

    expect(backdrop).toBe("sky");
  });
});

describe("表示の設定で切り替える見た目", () => {
  it("透明度を下げると、ガラスを不透明にする印を付ける", () => {
    const looks = 表示の設定で切り替える見た目({
      reduceTransparency: true,
      reduceMotion: false,
    });

    expect(looks).toEqual({
      "reduce-transparency": true,
      "reduce-motion": false,
    });
  });

  it("視差効果を減らすと、動きを止める印を付ける", () => {
    const looks = 表示の設定で切り替える見た目({
      reduceTransparency: false,
      reduceMotion: true,
    });

    expect(looks).toEqual({
      "reduce-transparency": false,
      "reduce-motion": true,
    });
  });
});
