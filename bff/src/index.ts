import { WorkerEntrypoint } from "cloudflare:workers";
import { compressImage } from "./compress-image";

export class RpcService extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    return new Response("直リンク禁止", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  async compress(image: ArrayBuffer): Promise<Uint8Array> {
    return await compressImage({ image });
  }

  async example(): Promise<string> {
    return "返ってきてるよ";
  }
}

export default RpcService;
