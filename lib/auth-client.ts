import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";
import {
  adminAccessControl,
  organizationRoles,
  orgAccessControl,
  platformRoles,
} from "@/lib/auth-permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac: adminAccessControl,
      roles: platformRoles,
    }),
    organizationClient({
      ac: orgAccessControl,
      roles: organizationRoles,
    }),
  ],
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  organization,
  admin,
} = authClient;
