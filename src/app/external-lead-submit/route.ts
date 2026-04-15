import { NextResponse } from "next/server";
import {
  buildExternalLeadReturnUrl,
  handleExternalLeadSubmission,
  parseExternalLeadRequestBody,
} from "@/lib/external-lead";

export async function POST(request: Request) {
  try {
    const rawBody = await parseExternalLeadRequestBody(request);
    const result = await handleExternalLeadSubmission(request, rawBody);
    const redirectUrl = buildExternalLeadReturnUrl(request, result.input, result);

    return NextResponse.redirect(redirectUrl, {
      status: 303,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send your request.";
    const redirectUrl = buildExternalLeadReturnUrl(request, null, {
      ok: false,
      error: message,
    });

    return NextResponse.redirect(redirectUrl, {
      status: 303,
    });
  }
}
