/** @jsxRuntime classic */
/** @jsx h */
import { h } from "preact";
import DataIsland from "../islands/DataIsland.tsx";
import WakeLockIsland from "../components/WakeLockIsland.tsx";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Fresh SSE Example!IIIII</h1>
      <WakeLockIsland />
      <DataIsland />
    </div>
  );
}


