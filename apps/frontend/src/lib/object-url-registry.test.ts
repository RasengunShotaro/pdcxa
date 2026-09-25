import { describe, expect, it } from "vitest";
import { createObjectUrlRegistry } from "./object-url-registry";

const createRegistryHarness = () => {
  const issued: string[] = [];
  const revoked: string[] = [];
  const registry = createObjectUrlRegistry({
    create: () => {
      const url = `blob:test/${issued.length + 1}`;
      issued.push(url);
      return url;
    },
    revoke: (url) => {
      revoked.push(url);
    },
  });
  return { registry, issued, revoked };
};

const anImage = (): Blob => new Blob(["image"], { type: "image/jpeg" });

describe("createObjectUrlRegistry", () => {
  it("利用を始めた画像には表示用の URL が割り当てられる", () => {
    const { registry } = createRegistryHarness();
    const image = anImage();

    registry.acquire(image);

    expect(registry.urlOf(image)).toBe("blob:test/1");
  });

  it("利用していない画像には表示用の URL が無い", () => {
    const { registry } = createRegistryHarness();

    const result = registry.urlOf(anImage());

    expect(result).toBeNull();
  });

  it("同じ画像を複数箇所で表示しても URL は 1 つだけ発行する", () => {
    const { registry, issued } = createRegistryHarness();
    const image = anImage();

    registry.acquire(image);
    registry.acquire(image);

    expect(issued).toEqual(["blob:test/1"]);
  });

  it("まだ表示している箇所が残っている間は URL を解放しない", () => {
    const { registry, revoked } = createRegistryHarness();
    const image = anImage();
    registry.acquire(image);
    registry.acquire(image);

    registry.release(image);

    expect(revoked).toEqual([]);
  });

  it("最後の表示箇所が無くなると URL を解放する", () => {
    const { registry, revoked } = createRegistryHarness();
    const image = anImage();
    registry.acquire(image);
    registry.acquire(image);
    registry.release(image);

    registry.release(image);

    expect(revoked).toEqual(["blob:test/1"]);
  });

  it("解放した画像には表示用の URL が残らない", () => {
    const { registry } = createRegistryHarness();
    const image = anImage();
    registry.acquire(image);

    registry.release(image);

    expect(registry.urlOf(image)).toBeNull();
  });

  it("解放した画像を再び表示すると新しい URL を発行する", () => {
    const { registry } = createRegistryHarness();
    const image = anImage();
    registry.acquire(image);
    registry.release(image);

    registry.acquire(image);

    expect(registry.urlOf(image)).toBe("blob:test/2");
  });

  it("利用していない画像の解放は何もしない", () => {
    const { registry, revoked } = createRegistryHarness();

    registry.release(anImage());

    expect(revoked).toEqual([]);
  });
});
