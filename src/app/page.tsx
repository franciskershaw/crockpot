import Auth from "@/components/page/LandingPage/Auth/Auth";
import HeroSection from "@/components/page/LandingPage/HeroSection/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Hero Section with Auth Card */}
      <section className="">
        <div className="container mx-auto px-4 pt-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <HeroSection />
            <Auth />
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      {/* <FeaturedRecipes /> */}

      {/* Features Section */}
      {/* <FeaturesSection /> */}
    </div>
  );
}
