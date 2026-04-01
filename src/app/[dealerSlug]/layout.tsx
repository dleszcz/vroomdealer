import { notFound } from "next/navigation";
import { getProfile } from "@/lib/data";
import { DealerHeader } from "@/components/dealer-header";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";

export default async function DealerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealerSlug: string }>;
}) {
  const { dealerSlug } = await params;
  const profile = await getProfile(dealerSlug);

  if (!profile) {
    notFound();
  }

  return (
    <>
      {profile.pixel_id && <MetaPixel pixelId={profile.pixel_id} />}
      <DealerHeader profile={profile} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
