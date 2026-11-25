import { describe, expect, it } from "vitest";
import {
  BACKDROP_PHOTOS,
  type BackdropPhoto,
  背景の写真を選ぶ,
} from "./droplet-photos";

const aPhoto = (overrides: Partial<BackdropPhoto> = {}): BackdropPhoto => ({
  name: "sample",
  src: "/signin/sample.webp",
  photographer: "Sample Photographer",
  pageUrl: "https://unsplash.com/photos/sample",
  poolColor: [1, 1, 1],
  poolStrength: 1,
  groundOffset: 2,
  ...overrides,
});

describe("背景の写真を選ぶ", () => {
  it("URL で名前を指定するとその写真に固定する", () => {
    const photo = 背景の写真を選ぶ({
      search: "?bg=lake",
      random: 0,
      photos: [aPhoto({ name: "forest" }), aPhoto({ name: "lake" })],
    });

    expect(photo?.name).toBe("lake");
  });

  it("指定が無いときは乱数が小さいと先頭の写真になる", () => {
    const photo = 背景の写真を選ぶ({
      search: "",
      random: 0,
      photos: [aPhoto({ name: "forest" }), aPhoto({ name: "lake" })],
    });

    expect(photo?.name).toBe("forest");
  });

  it("指定が無いときは乱数が大きいと末尾の写真になる", () => {
    const photo = 背景の写真を選ぶ({
      search: "",
      random: 0.999,
      photos: [aPhoto({ name: "forest" }), aPhoto({ name: "lake" })],
    });

    expect(photo?.name).toBe("lake");
  });

  it("知らない名前を指定されたときはランダムに選ぶ", () => {
    const photo = 背景の写真を選ぶ({
      search: "?bg=unknown",
      random: 0.999,
      photos: [aPhoto({ name: "forest" }), aPhoto({ name: "lake" })],
    });

    expect(photo?.name).toBe("lake");
  });

  it("写真が 1 枚も無いときは何も選ばない", () => {
    const photo = 背景の写真を選ぶ({ search: "", random: 0.5, photos: [] });

    expect(photo).toBeNull();
  });
});

describe("BACKDROP_PHOTOS", () => {
  it("写真の名前は重複しない", () => {
    const names = BACKDROP_PHOTOS.map((photo) => photo.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it("どの写真にも撮影者と写真ページがある", () => {
    const incomplete = BACKDROP_PHOTOS.filter(
      (photo) =>
        photo.photographer.length === 0 ||
        !photo.pageUrl.startsWith("https://unsplash.com/photos/"),
    );

    expect(incomplete).toEqual([]);
  });
});
