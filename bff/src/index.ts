import { WorkerEntrypoint } from "cloudflare:workers";
import { optimizeImage } from "wasm-image-optimization";

export class RpcService extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    return new Response("直リンク禁止", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  async compress(image: ArrayBuffer, quality: number): Promise<Uint8Array> {
    return (await optimizeImage({
      image: image,
      format: "avif",
      quality: quality,
      speed: 10,
    })) as Uint8Array;
  }
}

export default RpcService;
