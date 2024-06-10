import Banner from "@/components/HomePage/Banner";
import Categorybar from "@/components/HomePage/Categorybar";
import FilterHome from "@/components/HomePage/FilterHome";

import TitleBar from "@/components/HomePage/TitleBar";


export const HomePage = () => {
  return (
    <>

      <FilterHome></FilterHome>
      <TitleBar></TitleBar>

      <Categorybar></Categorybar>
      <TitleBar></TitleBar>
      <Categorybar></Categorybar>
      <Banner></Banner>
      <TitleBar></TitleBar>
      <Categorybar></Categorybar>
    </>
  );
};
