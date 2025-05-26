import { WorkerEntrypoint } from "cloudflare:workers";
import { compressImage } from "./compress-image";

export class RpcService extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    return new Response("直リンク禁止", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  async compress(image: ArrayBuffer, quality: number): Promise<Uint8Array> {
    return await compressImage({ image, quality });
  }
}

export default RpcService;
