import { NextResponse } from "next/server";
import {
  corsHeaders,
  handleExternalLeadSubmission,
  parseExternalLeadRequestBody,
} from "@/lib/external-lead";

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get("origin"));

  try {
    const rawBody = await parseExternalLeadRequestBody(request);
    const result = await handleExternalLeadSubmission(request, rawBody);

    return NextResponse.json(
      result.ok
        ? {
            ok: true,
            lead: result.lead,
            telegramSkipped: result.telegramSkipped,
            telegramError: result.telegramError,
            sheetSkipped: result.sheetSkipped,
            sheetError: result.sheetError,
          }
        : { ok: false, error: result.error },
      { status: result.status, headers },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500, headers });
  }
}
