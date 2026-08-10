import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { Lead } from "@/types/landing";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerPhone || !body.dealerId) {
      return NextResponse.json(
        { error: "Wymagany jest numer telefonu oraz identyfikator komisu." },
        { status: 400 }
      );
    }

    const leadData: Lead = {
      dealerId: body.dealerId,
      source: body.source || "lead_form",
      campaign: body.campaign,
      landingPath: body.landingPath || "/",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      vehicleDetails: body.vehicleDetails,
      status: "new",
    };

    const result = await createLead(leadData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: unknown) {
    console.error("API /api/leads Error:", err);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas przetwarzania formularza." },
      { status: 500 }
    );
  }
}
