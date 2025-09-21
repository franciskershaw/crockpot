export default async function Loading() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        fontFamily: "var(--font-geist-sans)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col items-center gap-6 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        {/* CSS Loader Animation */}
        <div className="loader"></div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-brand-primary">
            Crockpot
          </h2>
          <p className="text-sm opacity-70 text-soft">
            Cooking up something delicious...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-1" />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-2" />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-3" />
        </div>
      </div>
    </div>
  );
}
