import { LINE_Seed_JP, Outfit } from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const lineSeedJp = LINE_Seed_JP({
  weight: ["400", "700"],
  preload: false,
  display: "swap",
  variable: "--font-line-seed-jp",
});
