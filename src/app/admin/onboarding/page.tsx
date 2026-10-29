import { DealerOnboardingWizard } from "@/features/onboarding/components/dealer-onboarding-wizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Onboarding Nowego Dealera • VroomDealer",
  description: "Kreator wdrożeniowy zbierający komplet danych i generujący kod konfiguracyjny",
};

export default function AdminOnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Powrót do dashboardu</span>
        </Link>
      </div>

      <DealerOnboardingWizard />
    </main>
  );
}
