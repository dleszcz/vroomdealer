import { Car } from "@/types/database";
import { formatMileage } from "@/lib/utils";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Zap,
  PaintBucket,
} from "lucide-react";

interface CarSpecsProps {
  car: Car;
}

export function CarSpecs({ car }: CarSpecsProps) {
  const specs = [
    { label: "Rocznik", value: car.year?.toString(), icon: Calendar },
    { label: "Przebieg", value: car.mileage ? formatMileage(car.mileage) : null, icon: Gauge },
    { label: "Paliwo", value: car.fuel_type, icon: Fuel },
    { label: "Skrzynia biegów", value: car.transmission, icon: Settings2 },
    { label: "Silnik", value: car.engine_capacity, icon: Zap },
    { label: "Kolor", value: car.color, icon: PaintBucket },
  ].filter((s) => s.value);

  return (
    <div className="specs" id="car-specs">
      <h2 className="specs__title">Dane techniczne</h2>
      <div className="specs__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', borderTop: 'none' }}>
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <div key={spec.label} className="specs__item" style={{ borderBottom: 'none', padding: '1rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ color: 'var(--color-brand)', opacity: 0.8 }}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="specs__label" style={{ fontSize: '0.75rem', marginBottom: '0' }}>{spec.label}</div>
                <div className="specs__value" style={{ fontSize: '0.9rem' }}>{spec.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
