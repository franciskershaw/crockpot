import SearchBar from "@/src/components/FormSearchBar/SearchBar";
import { useState } from "react";
import Accordion from "@/src/components/Accordion/Accordion";

const ShoppingList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const accordionItems = [
    {
      heading: "Meat",
      children: (
        <div>
          <h1>test</h1>
          <p>test</p>
        </div>
      ),
    },
    {
      heading: "Herbs & Spices",
      children: (
        <div>
          <h1>test</h1>
          <p>test</p>
        </div>
      ),
    },
    {
      heading: "Cupboard",
      children: (
        <div>
          <h1>test</h1>
          <p>test</p>
        </div>
      ),
    },
  ];

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
      {/* Shopping list */}
      <Accordion items={accordionItems} />
    </div>
  );
};

export default ShoppingList;
