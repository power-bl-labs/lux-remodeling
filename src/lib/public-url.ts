type RequestLike = Pick<Request, "url" | "headers">;

function getForwardedHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

export function getPublicOrigin(request: RequestLike) {
  const configuredBaseUrl = process.env.NEXTAUTH_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const forwardedHost = getForwardedHeaderValue(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  );
  const forwardedProto = getForwardedHeaderValue(
    request.headers.get("x-forwarded-proto"),
  );

  if (forwardedHost) {
    const protocol =
      forwardedProto ||
      (forwardedHost.startsWith("localhost") ||
      forwardedHost.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${protocol}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export function buildPublicUrl(request: RequestLike, pathname: string) {
  return new URL(pathname, getPublicOrigin(request));
}
