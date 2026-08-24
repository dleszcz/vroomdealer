import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const sbCookies = allCookies.filter((c) => c.name.startsWith("sb-"));

  return NextResponse.json({
    totalCookies: allCookies.length,
    cookieNames: allCookies.map((c) => c.name),
    sbCookies: sbCookies.map((c) => ({
      name: c.name,
      valueLength: c.value.length,
      valuePreview: c.value.substring(0, 50) + "...",
    })),
  });
}
