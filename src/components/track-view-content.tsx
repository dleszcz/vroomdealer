"use client";

import { useEffect } from "react";
import { Car } from "@/types/database";

interface TrackViewContentProps {
  car: Car;
}

export function TrackViewContent({ car }: TrackViewContentProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_ids: [car.id],
        content_type: "product",
        content_name: `${car.make} ${car.model}`,
        value: car.price || 0,
        currency: "PLN",
      });
      console.log("➡️ Meta Pixel: ViewContent tracked", car.id);
    }
  }, [car.id, car.make, car.model, car.price]);

  return null;
}
