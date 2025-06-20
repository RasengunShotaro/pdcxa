export type Bindings = {
  Bindings: {
    R2: R2Bucket;
    BFF: {
      compress: (image: ArrayBuffer, quality: number) => Promise<Uint8Array>;
    };
  };
};
