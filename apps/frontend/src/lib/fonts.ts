import localFont from "next/font/local";

export const udShinGo = localFont({
  src: [
    {
      path: "../../public/fonts/UDShinGo-Light.otf",
      weight: "300",
    },
    {
      path: "../../public/fonts/UDShinGo-Regular.otf",
      weight: "400",
    },
    {
      path: "../../public/fonts/UDShinGo-Bold.otf",
      weight: "700",
    },
  ],
  preload: true,
  display: "swap",
});
