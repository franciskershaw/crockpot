import Auth from "@/components/page/LandingPage/Auth/Auth";
import HeroSection from "@/components/page/LandingPage/HeroSection/HeroSection";

export default function Home() {
  return (
    <div className="container mx-auto pt-16 lg:py-24">
      {/* Hero Section with Auth Card */}
      <section className="">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <HeroSection />
          <Auth />
        </div>
      </section>

      {/* Featured Recipes Section */}
      {/* <FeaturedRecipes /> */}

      {/* Features Section */}
      {/* <FeaturesSection /> */}
    </div>
  );
}
