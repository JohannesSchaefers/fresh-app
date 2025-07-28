/*
import { Handlers, PageProps } from "$fresh/server.ts";

interface Data {
  [key: string]: unknown;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const resp = await fetch(new URL("/api/data", ctx.url).toString());
    const data = (await resp.json()) || {};
    return ctx.render(data);
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 20 }}>
      <h1>Last received data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <p>
        <i>Send JSON data via POST to <code>/api/data</code> (e.g. using Postman)</i>
      </p>
    </div>
  );
}
*/

/** @jsxRuntime classic */
/** @jsx h */
import { h } from "preact";
import DataIsland from "../islands/DataIsland.tsx";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Fresh SSE Example!!!??!</h1>
      <DataIsland />
    </div>
  );
}


