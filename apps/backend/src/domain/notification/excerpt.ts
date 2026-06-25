const EXCERPT_MAX_LENGTH = 100;

export const 抜粋にする = (content: string): string => {
  const chars = [...content];
  if (chars.length <= EXCERPT_MAX_LENGTH) {
    return content;
  }
  return `${chars.slice(0, EXCERPT_MAX_LENGTH).join("")}…`;
};
