interface CloudflareEnv {
  BFF: {
    fetch: (request: Request) => Promise<Response>;
    add: (a: number, b: number) => Promise<number>;
  };
}
