import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";
import {
  adminAc as orgAdminAc,
  defaultStatements as orgDefaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

/** Platform admin-plugin roles shown in user management: Admin / Editor / Viewer */
export const adminStatement = {
  ...defaultStatements,
} as const;

export const adminAccessControl = createAccessControl(adminStatement);

export const adminRole = adminAccessControl.newRole({
  ...adminAc.statements,
});

export const editorRole = adminAccessControl.newRole({
  user: ["create", "list", "get", "update", "ban", "set-role", "set-password"],
  session: ["list", "revoke"],
});

export const viewerRole = adminAccessControl.newRole({
  user: ["list", "get"],
  session: ["list"],
});

/** Legacy default — treated like Viewer in the UI */
export const legacyUserRole = adminAccessControl.newRole({
  ...userAc.statements,
});

export const platformRoles = {
  admin: adminRole,
  editor: editorRole,
  viewer: viewerRole,
  user: legacyUserRole,
} as const;

export type PlatformRole = "admin" | "editor" | "viewer";

export const PLATFORM_ROLE_OPTIONS: Array<{ value: PlatformRole; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

export function normalizePlatformRole(role: string | null | undefined): PlatformRole {
  const primary = (role ?? "viewer").split(",")[0]?.trim().toLowerCase();
  if (primary === "admin") return "admin";
  if (primary === "editor") return "editor";
  return "viewer";
}

/** Organization RBAC — keep owner + map Admin/Editor/Viewer for invites */
export const orgStatement = {
  ...orgDefaultStatements,
} as const;

export const orgAccessControl = createAccessControl(orgStatement);

export const orgOwnerRole = orgAccessControl.newRole({
  ...ownerAc.statements,
});

export const orgAdminRole = orgAccessControl.newRole({
  ...orgAdminAc.statements,
});

export const orgEditorRole = orgAccessControl.newRole({
  ...memberAc.statements,
  invitation: ["create"],
  member: ["create", "update"],
  ac: ["read"],
});

export const orgViewerRole = orgAccessControl.newRole({
  ...memberAc.statements,
  ac: ["read"],
});

export const orgMemberRole = orgAccessControl.newRole({
  ...memberAc.statements,
});

export const organizationRoles = {
  owner: orgOwnerRole,
  admin: orgAdminRole,
  editor: orgEditorRole,
  viewer: orgViewerRole,
  member: orgMemberRole,
} as const;

export function platformRoleToOrgRole(role: PlatformRole): "admin" | "editor" | "viewer" {
  return role;
}
