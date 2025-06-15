interface CloudflareEnv {
  BFF: {
    compress: (image: ArrayBuffer, quality: number) => Promise<Uint8Array>;
  };
  R2: R2Bucket;
}
