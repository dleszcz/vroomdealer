"use client";

import { useEffect } from "react";
import { Car } from "@/types/database";
import { trackEvent } from "@/lib/analytics";

interface TrackVehicleViewProps {
  car: Car;
}

export function TrackVehicleView({ car }: TrackVehicleViewProps) {
  useEffect(() => {
    trackEvent("vehicle_viewed", {
      content_ids: [car.id],
      content_type: "product",
      content_name: `${car.make} ${car.model}`,
      value: car.price || 0,
      currency: "PLN",
    });
  }, [car.id, car.make, car.model, car.price]);

  return null;
}
