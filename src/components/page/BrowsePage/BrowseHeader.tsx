import SearchBar from "./SearchBar";

const BrowseHeader = () => {
  return (
    <div className="sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm  py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
            Browse Recipes
          </h1>
        </div>

        <SearchBar />
      </div>
    </div>
  );
};

export default BrowseHeader;
