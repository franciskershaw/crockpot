import Auth from "@/components/auth/Auth";
import HeroSection from "@/components/auth/HeroSection";
// import HowItWorksSection from "@/components/landing/HowItWorksSection";
// import PricingSection from "@/components/landing/PricingSection";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Auth Card */}
      <SectionWrapper className="pt-8 md:pt-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroSection />
          <div className="flex justify-center lg:justify-end">
            <Auth />
          </div>
        </div>
      </SectionWrapper>

      {/* <SectionWrapper>
        <HowItWorksSection />
      </SectionWrapper>

      <SectionWrapper>
        <PricingSection />
      </SectionWrapper> */}
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
