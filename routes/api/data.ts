/*
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
    let keepAliveInterval: number | undefined = undefined;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        clientController = controller;
        clients.add(controller);

        const encoder = new TextEncoder();

        // Send initial data immediately
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(lastData)}\n\n`));

        // Set up keep-alive ping every 15 seconds
        keepAliveInterval = setInterval(() => {
          try {
            // Send a comment line as keep-alive
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
