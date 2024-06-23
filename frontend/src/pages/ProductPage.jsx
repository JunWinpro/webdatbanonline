import { useState, useEffect } from "react";
import BookingBanner from "@/components/ProductPage/BookingBanner";

export const ProductPage = () => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const triggerPosition = 500;

      setIsFloating(scrollPosition > triggerPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="bg-slate-100">
        <div className="w-full flex justify-center">
          <BookingBanner />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-7/12 flex justify-end">
            <div className="bg-white w-11/12 h-96 rounded-lg">

            </div>
          </div>


          <div
            className={`flex justify-end rounded-lg w-2/6  transition-all duration-75 ease-in-out ${
              isFloating ? "fixed top-10 right-0 mr-20 z-50" : ""
            }`}
          >
            <div className=" w-10/12 mr-16 bg-white h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
    </>
  );
};
