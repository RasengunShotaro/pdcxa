export const 拡張fetch = async <T>(
  ...args: Parameters<typeof fetch>
): Promise<T & Record<string, unknown>> => {
  const response = await fetch(args[0], args[1]);
  return await response.json();
};
