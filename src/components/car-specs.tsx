import { Car } from "@/types/database";
import { formatMileage } from "@/lib/utils";

interface CarSpecsProps {
  car: Car;
}

export function CarSpecs({ car }: CarSpecsProps) {
  const specs = [
    { label: "Rocznik", value: car.year?.toString() },
    { label: "Przebieg", value: car.mileage ? formatMileage(car.mileage) : null },
    { label: "Paliwo", value: car.fuel_type },
    { label: "Silnik", value: car.engine_capacity },
    { label: "Skrzynia biegów", value: car.transmission },
    { label: "Kolor", value: car.color },
  ].filter((s) => s.value);

  return (
    <div className="specs" id="car-specs">
      <h2 className="specs__title">Dane techniczne</h2>
      <dl className="specs__grid">
        {specs.map((spec) => (
          <div key={spec.label} className="specs__item">
            <dt className="specs__label">{spec.label}</dt>
            <dd className="specs__value">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
