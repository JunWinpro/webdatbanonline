import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

const SearchBanner = () => {
  return (
    <>
      <div className="flex">
        <Input>

        </Input>
        <Button className="my-5 h-8 border-0 hover:border-white hover:border-b-0 bg-white">Search</Button>
      </div>
    </>
  );
};

export default SearchBanner;
