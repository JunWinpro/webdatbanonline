import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

const BookingBanner = () => {
 const [currentIndex, setCurrentIndex] = useState(0);
 const [clickedIndex, setClickedIndex] = useState(null);
 const [isTransitioning, setIsTransitioning] = useState(false);
 const [prevIndex, setPrevIndex] = useState(0);
 const imageUrls = [
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-2560x1440-chat-luong-cao-1920x1080.jpg",
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-2560x1440-dep-nhat-1920x1080.jpg",
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-2560x1440-dep-1920x1080.jpg",
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-do-phan-giai-2560x1440-1-1920x1080.jpg",
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-nen-2k-dep-nhat-1920x1080.jpg",
   "https://anhdepfree.com/wp-content/uploads/2020/03/anh-nen-2560x1440-cho-may-tinh-1920x1080.jpg",
 ];

 const handleTransitionEnd = () => {
   setIsTransitioning(false);
 };

 const resetTransition = () => {
   setIsTransitioning(true);
   setTimeout(() => {
     setIsTransitioning(false);
   }, 0);
 };

 useEffect(() => {
   if (clickedIndex !== null) {
     setPrevIndex(currentIndex);
     setCurrentIndex(clickedIndex);
     setClickedIndex(null);
   }

   const interval = setInterval(() => {
     resetTransition();
     setPrevIndex(currentIndex);
     setCurrentIndex((currentIndex + 1) % imageUrls.length);
   }, 5000);

   return () => clearInterval(interval);
 }, [currentIndex, clickedIndex, imageUrls.length]);

 const handleNext = () => {
   resetTransition();
   setPrevIndex(currentIndex);
   setCurrentIndex((currentIndex + 1) % imageUrls.length);
 };

 const handlePrev = () => {
   resetTransition();
   setPrevIndex(currentIndex);
   setCurrentIndex((currentIndex - 1 + imageUrls.length) % imageUrls.length);
 };

 const handleThumbnailClick = (index) => {
   resetTransition();
   setPrevIndex(currentIndex);
   setClickedIndex(index);
 };

 return (
   <div className="flex w-full max-w-screen-xl">
     <div className="carousel relative w-2/3 overflow-hidden">
       <div
         className={`carousel-inner w-full h-full transition-transform duration-500 ${
           isTransitioning
             ? currentIndex > prevIndex
               ? "translate-x-full"
               : "-translate-x-full"
             : ""
         }`}
         onTransitionEnd={handleTransitionEnd}
       >
         <img
           src={imageUrls[currentIndex]}
           alt="Carousel"
           className="w-full object-cover aspect-[20/10] rounded-lg"
         />
       </div>
       <div className="carousel-controls absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-3">
         <button
           onClick={handlePrev}
           className="carousel-control prev p-3 py-4 rounded-md  bg-white/50 "
         >
           &#8249;
         </button>
         <button
           onClick={handleNext}
           className="carousel-control next p-3 py-4 rounded-md bg-white/50"
         >
           &#8250;
         </button>
       </div>
     </div>
     <div className="w-1/3 flex flex-col">
       {[
         [0, 1],
         [2, 3],
         [4, 5],
       ].map((row, rowIndex) => (
         <div key={rowIndex} className="flex">
           {row.map((index) => (
             <div
               key={index}
               className={`w-1/2 relative mx-2 mb-4 rounded-md overflow-hidden ${
                 index === 5 ? "filter brightness-50" : ""
               }`}
               style={{ paddingBottom: "30.7%" }}
               onClick={() => handleThumbnailClick(index)}
             >
               <img
                 src={imageUrls[index]}
                 alt={`Thumbnail ${index}`}
                 className="absolute inset-0 w-full h-full object-cover rounded-md"
               />
               {index === 5 && (
                 <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                   Show All
                 </div>
               )}
             </div>
           ))}
         </div>
       ))}
     </div>
   </div>
 );
};

export default BookingBanner;