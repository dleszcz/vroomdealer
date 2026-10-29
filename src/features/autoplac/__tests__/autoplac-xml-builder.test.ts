import { describe, it, expect } from "vitest";
import { AutoplacXmlBuilder, escapeXml } from "../services/autoplac-xml-builder";
import { AutoplacFeedMetadata, AutoplacVehicleNode } from "../types";

describe("AutoplacXmlBuilder", () => {
  it("should escape special XML characters correctly", () => {
    expect(escapeXml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    expect(escapeXml("<tag>")).toBe("&lt;tag&gt;");
    expect(escapeXml('"quoted" and \'single\'')).toBe("&quot;quoted&quot; and &apos;single&apos;");
    expect(escapeXml(null)).toBe("");
    expect(escapeXml(undefined)).toBe("");
  });

  it("should generate a well-formed XML feed with vehicle and metadata", () => {
    const metadata: AutoplacFeedMetadata = {
      generatedAt: "2026-10-27T12:00:00.000Z",
      dealerName: "Komis D-Car & Syn",
      dealerCity: "Warszawa",
      dealerPhone: "+48 500 600 700",
      vehiclesCount: 1,
    };

    const vehicles: AutoplacVehicleNode[] = [
      {
        id: "veh-12345",
        vin: "WAUZZZ8K8BA123456",
        make: "Audi",
        model: "A4 B8",
        year: 2011,
        price: 32500,
        currency: "PLN",
        mileage: 215000,
        fuelType: "Diesel",
        engineCapacity: "1968",
        transmission: "Manualna",
        color: "Czarny",
        description: "Stan bardzo dobry, bezwypadkowy.",
        photos: [
          "https://example.com/photo1.jpg",
          "https://example.com/photo2.jpg",
        ],
        firstRegistrationDate: "2011-04-15",
      },
    ];

    const xml = AutoplacXmlBuilder.buildFeed(metadata, vehicles);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<feed xmlns="https://autoplac.pl/schema/export-v1" version="1.0">');
    expect(xml).toContain("<dealer_name>Komis D-Car &amp; Syn</dealer_name>");
    expect(xml).toContain("<id>veh-12345</id>");
    expect(xml).toContain("<vin>WAUZZZ8K8BA123456</vin>");
    expect(xml).toContain("<make>Audi</make>");
    expect(xml).toContain("<model>A4 B8</model>");
    expect(xml).toContain('<price currency="PLN">32500</price>');
    expect(xml).toContain('<mileage unit="km">215000</mileage>');
    expect(xml).toContain("<photo>https://example.com/photo1.jpg</photo>");
    expect(xml).toContain("<![CDATA[Stan bardzo dobry, bezwypadkowy.]]>");
  });
});
