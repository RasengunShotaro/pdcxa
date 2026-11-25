export type ToasterTheme = "light" | "dark";

interface ToasterThemeInput {
  forcedTheme: string | undefined;
  resolvedTheme: string | undefined;
}

export const トーストのテーマを決める = ({
  forcedTheme,
  resolvedTheme,
}: ToasterThemeInput): ToasterTheme =>
  (forcedTheme ?? resolvedTheme) === "dark" ? "dark" : "light";
