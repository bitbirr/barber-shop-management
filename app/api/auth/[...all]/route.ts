import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { corsHeadersForOrigin } from "@/lib/auth-origins";
import { prisma } from "@/lib/db";

const { GET: handleGet, POST: handlePost } = toNextJsHandler(auth.handler);

function withCors(response: Response, request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const cors = corsHeadersForOrigin(origin);
  const headers = new Headers(response.headers);
  cors.forEach((value, key) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function classifyDbError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/credentials|Authentication failed|P1000/i.test(message)) return "DB_AUTH_FAILED" as const;
  if (/Can't reach database server|P1001/i.test(message)) return "DB_UNREACHABLE" as const;
  return null;
}

function fail(request: Request, error: unknown, forcedCode?: "DB_AUTH_FAILED" | "DB_UNREACHABLE" | "INTERNAL_ERROR") {
  console.error("[auth]", error);
  const code = forcedCode ?? classifyDbError(error) ?? "INTERNAL_ERROR";

  return withCors(
    Response.json(
      {
        code,
        message:
          code === "DB_AUTH_FAILED"
            ? "Database credentials are invalid. Update DATABASE_URL on Railway."
            : code === "DB_UNREACHABLE"
              ? "Database is unreachable. Check DATABASE_URL host and network."
              : "Could not complete this request.",
      },
      { status: 500 },
    ),
    request,
  );
}

/** Better Auth often returns an empty 500 when Prisma init fails; probe DB to surface a clear code. */
async function maybeRewriteEmptyDbFailure(request: Request, response: Response) {
  if (response.status < 500) return withCors(response, request);

  const text = await response.clone().text();
  console.error("[auth] upstream 5xx", response.status, text || "(empty body)");

  if (text) return withCors(response, request);

  try {
    await prisma.$queryRaw`SELECT 1`;
    return withCors(response, request);
  } catch (error) {
    const code = classifyDbError(error) ?? "INTERNAL_ERROR";
    return fail(request, error, code);
  }
}

export async function GET(request: Request) {
  try {
    return await maybeRewriteEmptyDbFailure(request, await handleGet(request));
  } catch (error) {
    return fail(request, error);
  }
}

export async function POST(request: Request) {
  try {
    return await maybeRewriteEmptyDbFailure(request, await handlePost(request));
  } catch (error) {
    return fail(request, error);
  }
}

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return new Response(null, {
    status: 204,
    headers: corsHeadersForOrigin(origin),
  });
}
