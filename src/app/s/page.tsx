import { Suspense } from "react";
import ShareView from "./ShareView";

export default function SharePage() {
  return (
    <Suspense fallback={<div className="flex flex-col h-full bg-canvas" />}>
      <ShareView />
    </Suspense>
  );
}
