import { WorkerEntrypoint } from "cloudflare:workers";

export class RpcService extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    return new Response("Hello Rpc Service Worker!");
  }

  add(a: number, b: number): number {
    return a + b;
  }
}

export default RpcService;
