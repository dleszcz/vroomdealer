import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  // Main VroomDealer platform green theme
  const vroomGreen = "#10b981";

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
          border: `2px solid ${vroomGreen}`,
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "900",
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
