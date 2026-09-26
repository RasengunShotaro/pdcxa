import localFont from "next/font/local";

export const udShinGo = localFont({
  src: [
    {
      path: "../assets/fonts/UDShinGo-Regular.otf",
      weight: "400",
    },
    {
      path: "../assets/fonts/UDShinGo-Bold.otf",
      weight: "700",
    },
  ],
  preload: true,
  display: "swap",
});
