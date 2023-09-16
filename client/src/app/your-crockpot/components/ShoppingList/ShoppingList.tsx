import SearchBar from "@/src/components/FormSearchBar/SearchBar";
import { useState } from "react";

const ShoppingList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {/* header and search */}
        <h2 className="w-3/4 font-bold pt-3">Shopping List</h2>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          label="Search Extra Items"
        />
      </div>
      <div>
        Accordion
      </div>
    </div>
  );
};

export default ShoppingList;
