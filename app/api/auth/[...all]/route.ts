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

export async function GET(request: Request) {
  return withCors(await handleGet(request), request);
}

export async function POST(request: Request) {
  return withCors(await handlePost(request), request);
}

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return new Response(null, {
    status: 204,
    headers: corsHeadersForOrigin(origin),
  });
}
