import { describe, expect, it } from "vitest";
import { pd詳細へ移る共有要素の名前 } from "./pd-view-transition-name";

describe("pd詳細へ移る共有要素の名前", () => {
  it("同じ PD には一覧と詳細で同じ名前を付ける", () => {
    const fromList = pd詳細へ移る共有要素の名前("0190a1b2-c3d4-7e5f");

    const fromDetail = pd詳細へ移る共有要素の名前("0190a1b2-c3d4-7e5f");

    expect(fromList).toBe(fromDetail);
  });

  it("数字で始まる PD でも文字で始まる名前にする", () => {
    const name = pd詳細へ移る共有要素の名前("123");

    expect(name).toBe("pd-123");
  });

  it("名前に使えない記号は下線に置き換える", () => {
    const name = pd詳細へ移る共有要素の名前("a.b/c d");

    expect(name).toBe("pd-a_b_c_d");
  });
});
