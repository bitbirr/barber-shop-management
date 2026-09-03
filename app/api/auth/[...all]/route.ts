import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { corsHeadersForOrigin } from "@/lib/auth-origins";

const { GET: handleGet, POST: handlePost } = toNextJsHandler(auth.handler);

function withCors(response: Response, request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const cors = corsHeadersForOrigin(origin);
  cors.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}

function fail(request: Request, error: unknown) {
  console.error("[auth]", error);
  return withCors(
    Response.json(
      { code: "INTERNAL_ERROR", message: "Could not complete this request. Check server logs." },
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
    return withCors(await handlePost(request), request);
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
