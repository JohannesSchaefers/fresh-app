/*
curl.exe -X POST -H "Content-Type: application/json" -d '"1235"' http://localhost:8000/api/data
*/
/*

import type { Handlers } from "$fresh/server.ts";

let lastData: Record<string, unknown> = {}; // store the last received data

export const handler: Handlers = {
    async POST( req)  {

    try {
        lastData = await req.json();
        return new Response("Data received", { status: 200});
      } catch {
        return new Response("Invalid JSON", { status: 400});
      }
    },

GET() {
    return new Response( JSON.stringify( lastData), {
        status: 200,
        headers: { "Content-Type": "application/json"},
    });
},
};   
*/

import type { Handlers } from "$fresh/server.ts";

let lastData: Record<string, unknown> = {};
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

function notifyClients(data: Record<string, unknown>) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(msg);

  for (const client of clients) {
    try {
      client.enqueue(encoded);
    } catch {
      // Ignore errors from clients that might have disconnected
    }
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      lastData = await req.json();
      notifyClients(lastData);
      return new Response("Data received", { status: 200 });
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }
  },

  GET() {
    let clientController: ReadableStreamDefaultController<Uint8Array> | null = null;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        clientController = controller;
        clients.add(controller);

        // Send initial data immediately
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(lastData)}\n\n`));
      },

      cancel() {
        if (clientController) {
          clients.delete(clientController);
        }
      },
    });

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    return new Response(stream, { headers });
  },
};
