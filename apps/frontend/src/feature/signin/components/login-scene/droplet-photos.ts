export interface BackdropPhoto {
  readonly name: string;
  readonly src: string;
  readonly photographer: string;
  readonly pageUrl: string;
  readonly poolColor: readonly [number, number, number];
  readonly poolStrength: number;
  readonly groundOffset: number;
  readonly mirror?: boolean;
  readonly focus?: { readonly x: number; readonly y: number };
}

export const BACKDROP_PHOTOS: readonly BackdropPhoto[] = [
  {
    name: "sunset",
    src: "/signin/sunset-sea.webp",
    photographer: "Sergio Mena Ferreira",
    pageUrl:
      "https://unsplash.com/photos/ocean-waves-crashing-on-shore-during-sunset-N5sC8zZUgy4",
    poolColor: [1, 0.45, 0.3],
    poolStrength: 1,
    groundOffset: 1.95,
  },
  {
    name: "forest",
    src: "/signin/jungle-bridge.webp",
    photographer: "jim XP",
    pageUrl:
      "https://unsplash.com/photos/wooden-walkway-through-a-lush-green-rainforest-Xfnkpf3LWcc",
    poolColor: [1, 0.9, 0.6],
    poolStrength: 0.7,
    groundOffset: 2.05,
    mirror: true,
    focus: { x: 1, y: 0.5 },
  },
  {
    name: "dock",
    src: "/signin/maldives-villas.webp",
    photographer: "Upgraded Points",
    pageUrl:
      "https://unsplash.com/photos/brown-wooden-house-on-body-of-water-under-blue-sky-during-daytime-KenpE6DO1l0",
    poolColor: [0.75, 1, 0.92],
    poolStrength: 0.9,
    groundOffset: 2,
    focus: { x: 0.5, y: 0 },
  },
  {
    name: "desert",
    src: "/signin/fire-valley-road.webp",
    photographer: "Stin-Niels Musche",
    pageUrl:
      "https://unsplash.com/photos/gray-asphalt-road-between-brown-rocky-mountains-under-blue-sky-during-daytime-r0Bfx2PipQM",
    poolColor: [1, 0.82, 0.6],
    poolStrength: 0.6,
    groundOffset: 2.05,
  },
  {
    name: "valley",
    src: "/signin/sunrise-hills.webp",
    photographer: "Thilina Alagiyawanna",
    pageUrl:
      "https://unsplash.com/photos/golden-sunrise-over-rolling-mountains-and-a-winding-road-jQmEbJKiA4g",
    poolColor: [1, 0.8, 0.45],
    poolStrength: 0.7,
    groundOffset: 2,
  },
  {
    name: "woods",
    src: "/signin/woods-light.webp",
    photographer: "Michael Held",
    pageUrl:
      "https://unsplash.com/photos/green-trees-and-brown-dried-leaves-during-daytime-6fRHGqbp1_4",
    poolColor: [1, 0.86, 0.5],
    poolStrength: 0.75,
    groundOffset: 2.1,
  },
];

interface PickInput {
  readonly search: string;
  readonly random: number;
  readonly photos?: readonly BackdropPhoto[];
}

export const 背景の写真を選ぶ = ({
  search,
  random,
  photos = BACKDROP_PHOTOS,
}: PickInput): BackdropPhoto | null => {
  const requested = new URLSearchParams(search).get("bg");
  const fixed = photos.find((photo) => photo.name === requested);
  if (fixed) {
    return fixed;
  }
  const index = Math.min(
    photos.length - 1,
    Math.max(0, Math.floor(random * photos.length)),
  );
  return photos[index] ?? null;
};
