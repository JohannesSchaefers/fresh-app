/** @jsxRuntime classic */
/** @jsx h */
import { h } from "preact";
import DataIsland from "../islands/DataIsland.tsx";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Fresh SSE Example!</h1>
      <DataIsland />
    </div>
  );
}


