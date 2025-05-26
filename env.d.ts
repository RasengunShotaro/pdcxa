interface CloudflareEnv {
  BFF: {
    compress: (image: ArrayBuffer, quality: number) => Promise<Uint8Array>;
    example: () => Promise<string>;
  };
}
