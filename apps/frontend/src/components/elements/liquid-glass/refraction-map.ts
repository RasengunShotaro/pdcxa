interface ガラスの形 {
  readonly width: number;
  readonly height: number;
  readonly radius: number;
  readonly bezel: number;
}

interface 縁までの距離と向き {
  readonly distance: number;
  readonly normalX: number;
  readonly normalY: number;
}

const 角丸長方形の縁を測る = ({
  x,
  y,
  shape,
}: {
  x: number;
  y: number;
  shape: ガラスの形;
}): 縁までの距離と向き => {
  const radius = Math.min(shape.radius, shape.width / 2, shape.height / 2);
  const px = x - shape.width / 2;
  const py = y - shape.height / 2;
  const qx = Math.abs(px) - shape.width / 2 + radius;
  const qy = Math.abs(py) - shape.height / 2 + radius;
  const outsideX = Math.max(qx, 0);
  const outsideY = Math.max(qy, 0);
  const outsideLength = Math.hypot(outsideX, outsideY);
  const distance = outsideLength + Math.min(Math.max(qx, qy), 0) - radius;

  if (qx > 0 && qy > 0) {
    return {
      distance,
      normalX: (outsideX / outsideLength) * Math.sign(px),
      normalY: (outsideY / outsideLength) * Math.sign(py),
    };
  }
  return qx > qy
    ? { distance, normalX: Math.sign(px), normalY: 0 }
    : { distance, normalX: 0, normalY: Math.sign(py) };
};

const 縁での曲がりの強さ = (depthRatio: number): number =>
  (1 - depthRatio) ** 1.5;

const 色の値にする = (offset: number): number =>
  Math.round(128 + Math.max(-1, Math.min(1, offset)) * 127);

export const ガラスの屈折マップを作る = (
  shape: ガラスの形,
): Uint8ClampedArray<ArrayBuffer> => {
  const pixels = new Uint8ClampedArray(shape.width * shape.height * 4);

  for (let y = 0; y < shape.height; y++) {
    for (let x = 0; x < shape.width; x++) {
      const offset = (y * shape.width + x) * 4;
      const edge = 角丸長方形の縁を測る({ x: x + 0.5, y: y + 0.5, shape });
      const depth = -edge.distance;
      const strength =
        depth > 0 && depth < shape.bezel
          ? 縁での曲がりの強さ(depth / shape.bezel)
          : 0;

      pixels[offset] = 色の値にする(-edge.normalX * strength);
      pixels[offset + 1] = 色の値にする(-edge.normalY * strength);
      pixels[offset + 2] = 128;
      pixels[offset + 3] = 255;
    }
  }

  return pixels;
};
