// Invoke-RestMethod -Uri https://freshsse.deno.dev/api/data -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{ "value": 765 }'
// Data received


import type { Handlers } from "$fresh/server.ts";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Store the last received data (any valid JSON)
let lastData: JsonValue = null;

// Set of connected SSE client controllers
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

function notifyClients(data: JsonValue) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(msg);

  for (const client of clients) {
    try {
      client.enqueue(encoded);
    } catch {
      // Ignore errors for disconnected clients
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
    let keepAliveInterval: number | undefined = undefined;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        clientController = controller;
        clients.add(controller);

        const encoder = new TextEncoder();

        // Send initial data immediately
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(lastData)}\n\n`));

        // Keep-alive ping every 15 seconds to keep connection alive
        keepAliveInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: keep-alive\n\n`));
          } catch {
            // Ignore errors if client disconnected
          }
        }, 15000);
      },

      cancel() {
        if (clientController) {
          clients.delete(clientController);
        }
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
          keepAliveInterval = undefined;
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
