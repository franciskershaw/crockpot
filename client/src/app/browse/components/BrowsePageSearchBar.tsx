import Button from "@/src/components/Button/Button";
import SearchBar from "@/src/components/FormSearchBar/SearchBar";
import React, { useState } from "react";
import { AiFillFilter } from "react-icons/ai";
import { GrRefresh } from "react-icons/gr";

function BrowsePageSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="w-full">
        <SearchBar setSearchQuery={setSearchQuery} />
      </div>
      <Button border onClick={() => console.log("Hello!")}>
        <AiFillFilter />
      </Button>
      <Button border onClick={() => console.log("Hello!")}>
        <GrRefresh />
      </Button>
    </>
  );
}

export default BrowsePageSearchBar;
