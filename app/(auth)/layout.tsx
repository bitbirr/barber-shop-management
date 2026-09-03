import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account. Plume",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
