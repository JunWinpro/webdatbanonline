import React from "react";

import { SearchButton } from "../ui/Searchbutton";
import { Input } from "../ui/input";


const SearchBanner = () => {
  return (
    <>
      <div className="flex bg-gray-100 justify-center">
        
        <Input></Input>
        <SearchButton className="my-4 h-8 border-0 hover:border-white hover:border-b-0 ">
          Search
        </SearchButton>
      </div>
    </>
  );
};

export default SearchBanner;
