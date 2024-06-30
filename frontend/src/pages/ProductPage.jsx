import { useState, useEffect } from "react";
import BookingBanner from "@/components/ProductPage/BookingBanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const ProductPage = () => {
  const [isFloating, setIsFloating] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [arrivingDate, setArrivingDate] = useState(new Date());
  const [arrivingTime, setArrivingTime] = useState("12:00");

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

  const renderDropdown = (value, setValue, label) => (
    <div className="flex flex-col mb-4 w-full">
      <label className="mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="p-2 border rounded w-full"
      >
        {[...Array(21)].map((_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );

  const bookingTable = (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Booking Table</h2>
      <p className="mb-4">Please select your booking details:</p>
      <div className="flex justify-between mb-4 space-x-4">
        {renderDropdown(adults, setAdults, "Adults")}
        {renderDropdown(children, setChildren, "Children")}
      </div>
      <div className="flex justify-between">
        <div className="mb-4">
          <label className="block mb-2">Arriving Date</label>
          <DatePicker
            selected={arrivingDate}
            onChange={(date) => setArrivingDate(date)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Arriving Time</label>
          <input
            type="time"
            value={arrivingTime}
            onChange={(e) => setArrivingTime(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
      <div className="mt-2">
            <button
              id="sub_btn"
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Booking now
            </button>
          </div>
    </div>
  );

  return (
    <>
      <div className="bg-slate-100">
        <div className="w-full flex justify-center">
          <BookingBanner />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-7/12 flex justify-end">
            <div className=" w-11/12 rounded-lg">
              <div className="bg-white w-full rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-2">
                  Liberty Level 9 – Phạm Ngũ Lão
                </h1>
                <p className="text-lg mb-2">
                  Lầu 9, Số 265 Phạm Ngũ Lão, P. Phạm Ngũ Lão, Q. 1
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Loại hình:</span> Buffet, gọi
                  món Việt, Hải Sản
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Khoảng giá:</span> 200.000 -
                  500.000 đ/người
                </p>
                <p className="text-green-600">
                  <span className="font-semibold">Đang mở cửa:</span> 11:00 -
                  14:00
                </p>
              </div>
              <div className="bg-white w-full h-96 rounded-lg mt-10"></div>
            </div>
          </div>

          <div className="flex justify-end rounded-lg w-2/6">
            <div className="w-10/12 mr-16">{bookingTable}</div>
          </div>
        </div>
      </div>
      {isFloating && (
        <div className="fixed top-10 -right-4 mr-20 z-50 w-2/6 flex justify-end">
          <div className="w-10/12 mr-16">{bookingTable}</div>
        </div>
      )}
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
      <div className="h-96 bg-slate-100"></div>
    </>
  );
};
