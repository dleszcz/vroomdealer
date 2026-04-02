export interface Profile {
  id: string;
  slug: string;
  business_name: string;
  business_description: string | null;
  logo_url: string | null;
  pixel_id: string | null;
  whatsapp_number: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  has_towing: boolean;
  has_buying: boolean;
  created_at: string;
}

export interface Car {
  id: string;
  profile_id: string;
  slug: string;
  make: string;
  model: string;
  year: number | null;
  price: number | null;
  mileage: number | null;
  fuel_type: string | null;
  engine_capacity: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  images: string[];
  is_sold: boolean;
  is_featured: boolean;
  created_at: string;
}
