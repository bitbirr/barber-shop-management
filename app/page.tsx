import { Suspense } from "react";
import { BitBarberLanding } from "@/components/landing/plume-landing";

export const metadata = {
  title: "Bit-Barber System | All-in-one shop software for Ethiopia",
  description:
    "SaaS for Ethiopian barber shops. Book chairs, take ETB and Telebirr, run your floor from Addis to Hawassa.",
};

export default function Home() {
  return (
    <Suspense>
      <BitBarberLanding />
    </Suspense>
  );
}
