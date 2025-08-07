const ResponsiveRecipeGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {children}
    </div>
  );
};

export default ResponsiveRecipeGrid;
