import { describe, expect, it } from "vitest";
import {
  advanceCloudFade,
  advanceProgress,
  blendOf,
  blendTurns,
  CLOUD_COLUMN_COUNT,
  columnRect,
  computeAtmosphereSize,
  computeCloudLayerSize,
  initialLayerRoles,
  isColumnDue,
  isSnapshotComplete,
  rotateLayerRoles,
  snapshotPose,
} from "./sky-layers";

describe("computeCloudLayerSize", () => {
  it("高精細な画面では、雲を画面より粗く描いて引き伸ばす", () => {
    const size = computeCloudLayerSize({
      renderSize: { width: 2880, height: 1800 },
      pixelRatio: 2,
      overscan: 1,
      detail: 1,
    });

    expect(size).toEqual({ width: 2160, height: 1350 });
  });

  it("負荷が高いときは雲の層だけをさらに粗くする", () => {
    const size = computeCloudLayerSize({
      renderSize: { width: 2880, height: 1800 },
      pixelRatio: 2,
      overscan: 1,
      detail: 0.5,
    });

    expect(size).toEqual({ width: 1080, height: 675 });
  });

  it("大きな画面でも雲の層は上限の辺の長さに収める", () => {
    const size = computeCloudLayerSize({
      renderSize: { width: 5120, height: 2880 },
      pixelRatio: 2,
      overscan: 1,
      detail: 1,
    });

    expect(size).toEqual({ width: 2880, height: 1620 });
  });
});

describe("computeAtmosphereSize", () => {
  it("空のグラデーションは縦横比を保った小さな絵に焼く", () => {
    const size = computeAtmosphereSize({ width: 2880, height: 1800 });

    expect(size.width / size.height).toBeCloseTo(1.6, 2);
    expect(size.height).toBeLessThan(400);
  });
});

describe("columnRect", () => {
  it("分割した列が、隙間も重なりもなく層の幅を埋める", () => {
    const width = 2311;
    const columns = Array.from({ length: CLOUD_COLUMN_COUNT }, (_, index) =>
      columnRect({ index, width }),
    );

    const contiguous = columns.every(
      (column, index) =>
        column.x ===
        (index === 0
          ? 0
          : (columns[index - 1]?.x ?? 0) + (columns[index - 1]?.width ?? 0)),
    );
    const covered = columns.reduce((sum, column) => sum + column.width, 0);

    expect(contiguous).toBe(true);
    expect(covered).toBe(width);
  });
});

describe("雲の描き足しの進み方", () => {
  it("1 列を数コマに分けて進め、全列を描いたら 1 枚が完成する", () => {
    const start = { column: 0, frame: 0 };
    const afterOneFrame = advanceProgress(start);
    const afterTwoFrames = advanceProgress(afterOneFrame);

    expect(isColumnDue(start)).toBe(true);
    expect(isColumnDue(afterOneFrame)).toBe(false);
    expect(afterTwoFrames).toEqual({ column: 1, frame: 0 });
    expect(isSnapshotComplete({ column: CLOUD_COLUMN_COUNT, frame: 0 })).toBe(
      true,
    );
  });

  it("前後 2 枚の混ぜ具合は、描き足しの進みに合わせて 0 から 1 へ増える", () => {
    const begin = blendOf({ column: 0, frame: 0 });
    const middle = blendOf({ column: CLOUD_COLUMN_COUNT / 2, frame: 0 });
    const end = blendOf({ column: CLOUD_COLUMN_COUNT, frame: 0 });

    expect(begin).toBe(0);
    expect(middle).toBeCloseTo(0.5, 5);
    expect(end).toBe(1);
  });

  it("次の 1 枚ほど後の時刻と、先へ回した向きで描く", () => {
    const first = snapshotPose({ snapshot: 0, panRadiansPerSecond: 0.002 });
    const second = snapshotPose({ snapshot: 1, panRadiansPerSecond: 0.002 });

    expect(second.time).toBeGreaterThan(first.time);
    expect(second.pan).toBeGreaterThan(first.pan);
  });
});

describe("blendTurns", () => {
  it("混ぜている途中は、前の 1 枚を進め次の 1 枚を戻して同じ向きに合わせる", () => {
    const turns = blendTurns({
      blend: 0.25,
      hasMotion: true,
      panRadiansPerSecond: 0.002,
    });

    expect(turns.toPrevious).toBeGreaterThan(0);
    expect(turns.toNext).toBeLessThan(0);
    expect(turns.toPrevious - turns.toNext).toBeCloseTo(0.008, 6);
  });

  it("まだ 1 枚しか無いときは回さない", () => {
    const turns = blendTurns({
      blend: 0.5,
      hasMotion: false,
      panRadiansPerSecond: 0.002,
    });

    expect(turns).toEqual({ toPrevious: 0, toNext: 0 });
  });
});

describe("rotateLayerRoles", () => {
  it("最初の 1 枚が完成したら、その 1 枚だけを表示し別の層に描き始める", () => {
    const roles = rotateLayerRoles({
      roles: initialLayerRoles(),
      completedSnapshots: 0,
    });

    expect(roles.previous).toBe(0);
    expect(roles.next).toBe(0);
    expect(roles.work).not.toBe(0);
  });

  it("以後は、表示中の 2 枚とは別の層に描く", () => {
    const first = rotateLayerRoles({
      roles: initialLayerRoles(),
      completedSnapshots: 0,
    });
    const second = rotateLayerRoles({ roles: first, completedSnapshots: 1 });
    const third = rotateLayerRoles({ roles: second, completedSnapshots: 2 });

    expect(second.previous).toBe(first.next);
    expect(second.next).toBe(first.work);
    expect(new Set([third.previous, third.next, third.work]).size).toBe(3);
  });
});

describe("advanceCloudFade", () => {
  it("雲の現れ方は 1 を超えない", () => {
    const result = advanceCloudFade({ current: 0.9, deltaMs: 5000 });

    expect(result).toBe(1);
  });
});
