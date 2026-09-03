import { Suspense } from "react";
import { PlumeLanding } from "@/components/landing/plume-landing";

export const metadata = {
  title: "Plume. Design what you're imagining",
  description: "A friendly design agent that turns a sentence into a screen you can ship.",
};

export default function Home() {
  return (
    <Suspense>
      <PlumeLanding />
    </Suspense>
  );
}
