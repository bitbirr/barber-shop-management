import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { corsHeadersForOrigin } from "@/lib/auth-origins";

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

function fail(request: Request, error: unknown) {
  console.error("[auth]", error);
  const message = error instanceof Error ? error.message : String(error);
  const code = /credentials|Authentication failed|P1000/i.test(message)
    ? "DB_AUTH_FAILED"
    : /Can't reach database server|P1001/i.test(message)
      ? "DB_UNREACHABLE"
      : "INTERNAL_ERROR";

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

export async function GET(request: Request) {
  try {
    return withCors(await handleGet(request), request);
  } catch (error) {
    return fail(request, error);
  }
}

export async function POST(request: Request) {
  try {
    const response = await handlePost(request);
    if (response.status >= 500) {
      const text = await response.clone().text();
      console.error("[auth] upstream 5xx", response.status, text || "(empty body)");
    }
    return withCors(response, request);
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
