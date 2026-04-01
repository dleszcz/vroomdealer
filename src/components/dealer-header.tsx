import { Profile } from "@/types/database";
import Link from "next/link";

interface DealerHeaderProps {
  profile: Profile;
}

export function DealerHeader({ profile }: DealerHeaderProps) {
  return (
    <header className="dealer-header" id="dealer-header">
      <div className="dealer-header__container">
        <Link href={`/${profile.slug}`} className="dealer-header__brand">
          <div className="dealer-header__logo">
            {profile.business_name.charAt(0)}
          </div>
          <div>
            <h1 className="dealer-header__name">{profile.business_name}</h1>
            {profile.city && (
              <p className="dealer-header__location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profile.address ? `${profile.address}, ${profile.city}` : profile.city}
              </p>
            )}
          </div>
        </Link>

        {profile.phone_number && (
          <a
            href={`tel:${profile.phone_number.replace(/\s/g, "")}`}
            className="dealer-header__phone"
            aria-label="Zadzwoń"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{profile.phone_number}</span>
          </a>
        )}
      </div>
    </header>
  );
}
