interface CloudflareEnv {
  BFF: {
    compress: (image: ArrayBuffer) => Promise<Uint8Array>;
    example: () => Promise<string>;
  };
}
