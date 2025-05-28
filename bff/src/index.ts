import { WorkerEntrypoint } from "cloudflare:workers";
import { optimizeImage } from "wasm-image-optimization";

export class RpcService extends WorkerEntrypoint {
  async compress(image: ArrayBuffer, quality: number): Promise<Uint8Array> {
    return (await optimizeImage({
      image: image,
      format: "jpeg",
      quality: quality,
      speed: 10,
    })) as Uint8Array;
  }
}

export default RpcService;
