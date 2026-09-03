import { Suspense } from "react";
import AcceptInviteForm from "./accept-invite-form";

export default function Page() {
  return (
    <Suspense>
      <AcceptInviteForm />
    </Suspense>
  );
}
