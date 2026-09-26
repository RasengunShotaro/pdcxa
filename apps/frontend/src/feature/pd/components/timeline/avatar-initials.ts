const graphemeSegmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });

export const avatarInitials = (displayName: string): string => {
  const trimmed = displayName.trim();
  const [first] = graphemeSegmenter.segment(trimmed);
  if (!first) return "?";
  return first.segment.toUpperCase();
};
