import { describe, expect, it } from "vitest";
import { 一覧に新しく入った行を求める } from "./inserted-rows";

describe("一覧に新しく入った行を求める", () => {
  it("一覧を初めて表示するときは新しい行として扱わない", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: null,
      next: ["pd-2", "pd-1"],
      position: "head",
    });

    expect(inserted).toEqual([]);
  });

  it("先頭に投稿が 1 件入ったらその 1 件だけを新しい行とする", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["pd-2", "pd-1"],
      next: ["pd-3", "pd-2", "pd-1"],
      position: "head",
    });

    expect(inserted).toEqual(["pd-3"]);
  });

  it("続きのページが末尾に読み込まれても新しい行として扱わない", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["pd-4", "pd-3"],
      next: ["pd-4", "pd-3", "pd-2", "pd-1"],
      position: "head",
    });

    expect(inserted).toEqual([]);
  });

  it("先頭への投稿と末尾のページ読み込みが同時に届いたら先頭の投稿だけを新しい行とする", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["pd-3", "pd-2"],
      next: ["pd-4", "pd-3", "pd-2", "pd-1"],
      position: "head",
    });

    expect(inserted).toEqual(["pd-4"]);
  });

  it("前と 1 件も重ならない一覧に入れ替わったら新しい行として扱わない", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["pd-2", "pd-1"],
      next: ["pd-9", "pd-8"],
      position: "head",
    });

    expect(inserted).toEqual([]);
  });

  it("空だった一覧に最初の投稿が入ったらその投稿を新しい行とする", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: [],
      next: ["pd-1"],
      position: "head",
    });

    expect(inserted).toEqual(["pd-1"]);
  });

  it("行が消えただけなら新しい行は無い", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["pd-3", "pd-2", "pd-1"],
      next: ["pd-3", "pd-1"],
      position: "head",
    });

    expect(inserted).toEqual([]);
  });

  it("古い順の一覧では末尾に入った RePD を新しい行とする", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: ["repd-1", "repd-2"],
      next: ["repd-1", "repd-2", "repd-3"],
      position: "anywhere",
    });

    expect(inserted).toEqual(["repd-3"]);
  });

  it("古い順の一覧でも初めて表示するときは新しい行として扱わない", () => {
    const inserted = 一覧に新しく入った行を求める({
      previous: null,
      next: ["repd-1", "repd-2"],
      position: "anywhere",
    });

    expect(inserted).toEqual([]);
  });
});
