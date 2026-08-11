import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { Lead } from "@/types/landing";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dealerId = body.dealerId || body.dealer_id;
    const customerPhone = body.customerPhone || body.phone;
    const customerName = body.customerName || body.full_name || body.fullName;
    const customerEmail = body.customerEmail || body.email;
    const vehicleDetails = body.vehicleDetails || body.vehicle_details || body.car_details || body.carDetails;

    if (!customerPhone || !dealerId) {
      return NextResponse.json(
        { error: "Wymagany jest numer telefonu oraz identyfikator komisu." },
        { status: 400 }
      );
    }

    const leadData: Lead = {
      dealerId,
      source: body.source || "lead_form",
      campaign: body.campaign,
      landingPath: body.landingPath || "/",
      customerName,
      customerPhone,
      customerEmail,
      vehicleDetails,
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
