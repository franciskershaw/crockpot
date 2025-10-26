import { auth } from "@/auth";
import Auth from "@/components/landing/Auth";
import HeroSection from "@/components/landing/HeroSection";
// import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Transform the way you cook with Crockpot. Browse thousands of recipes, plan your weekly meals, and generate smart shopping lists automatically. Join our community of home cooks today.",
  openGraph: {
    title: "Crockpot - Your Recipe & Meal Planning Companion",
    description:
      "Browse thousands of recipes, plan your meals, and generate smart shopping lists automatically.",
    type: "website",
  },
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/your-crockpot");
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section with Auth Card */}
      <SectionWrapper className="pt-8 md:pt-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <HeroSection />
          <div className="flex justify-center lg:justify-end">
            <Auth />
          </div>
        </div>
      </SectionWrapper>

      {/* <SectionWrapper>
        <HowItWorksSection />
      </SectionWrapper> */}

      <SectionWrapper>
        <PricingSection />
      </SectionWrapper>
    </div>
  );
}

function SectionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("pb-8 md:pb-16 space-y-8 md:space-y-16", className)}>
      {children}
      <Separator />
    </section>
  );
}
