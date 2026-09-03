import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next ? `/?next=${encodeURIComponent(next)}#signin` : "/#signin";
  redirect(target);
}
