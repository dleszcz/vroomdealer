import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { resolveTenant } from "@/lib/tenant";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantSlug = searchParams.get("tenant") || searchParams.get("slug");

  if (!tenantSlug) {
    // Default green VroomDealer platform icon
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#060a14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "7px",
            border: "2px solid #10b981",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "900",
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            V
          </span>
        </div>
      ),
      { width: 32, height: 32 }
    );
  }

  const tenant = await resolveTenant({ slug: tenantSlug });

  const primaryColor = tenant?.branding?.colors?.primary || "#1686E0";
  
  const letter = (
    tenant?.businessName
      ? tenant.businessName.charAt(0)
      : tenantSlug.charAt(0)
  ).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#060a14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "7px",
          border: `2px solid ${primaryColor}`,
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "900",
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          {letter}
        </span>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
