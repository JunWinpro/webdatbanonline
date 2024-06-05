import Categorybar from "@/components/Categorybar";
import FilterHome from "@/components/FilterHome";
import SearchBanner from "@/components/SearchBanner";
import TitleBar from "@/components/TitleBar";

export const HomePage = () => {
  return (
    <>
      <SearchBanner></SearchBanner>
      <FilterHome></FilterHome>
      <TitleBar></TitleBar>
      <Categorybar></Categorybar>
      <TitleBar></TitleBar>
      <Categorybar></Categorybar>
      <TitleBar></TitleBar>
      <Categorybar></Categorybar>
    </>
  );
};
