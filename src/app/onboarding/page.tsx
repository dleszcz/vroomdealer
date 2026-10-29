import { DealerOnboardingWizard } from "@/features/onboarding/components/dealer-onboarding-wizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Formularz Wdrożeniowy Nowego Partnera • VroomDealer",
  description: "Wypełnij formularz wdrożeniowy swojego salonu samochodowego",
};

export default function PublicOnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót na stronę główną</span>
        </Link>
      </div>

      <DealerOnboardingWizard />
    </main>
  );
}
