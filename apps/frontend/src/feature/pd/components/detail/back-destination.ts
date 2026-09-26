export type BackDestination = "history" | "home";

interface BackDestinationInput {
  canGoBack: boolean | undefined;
  referrer: string;
  origin: string;
}

export const backDestination = ({
  canGoBack,
  referrer,
  origin,
}: BackDestinationInput): BackDestination => {
  if (canGoBack !== undefined) return canGoBack ? "history" : "home";
  if (!URL.canParse(referrer)) return "home";
  return new URL(referrer).origin === origin ? "history" : "home";
};
