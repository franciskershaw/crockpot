import HeroSection from "@/components/hero-section";
import AuthCard from "@/components/auth-card";
import FeaturedRecipes from "@/components/featured-recipes";
import FeaturesSection from "@/components/features-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Hero Section with Auth Card */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <HeroSection />
            <AuthCard />
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <FeaturedRecipes />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}
