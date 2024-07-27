import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingBanner from "@/components/ProductPage/BookingBanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const ProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [isFloating, setIsFloating] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [arrivingDate, setArrivingDate] = useState(new Date());
  const [arrivingTime, setArrivingTime] = useState("12:00");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants/restaurant/${id}`);
        if (response.data) {
          setProductData(response.data.data);

        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

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
        <BookingBanner images={productData?.restaurant?.images || []} />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-7/12 flex justify-end">
            <div className=" w-11/12 rounded-lg">
              <div className="bg-white w-full rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-2">
                  {productData?.restaurant?.name || "Loading..."}
                </h1>
                <p className="text-lg mb-2">
                  {productData?.restaurant?.address ? 
                    `${productData.restaurant.address.streetAddress}, ${productData.restaurant.address.district}, ${productData.restaurant.address.city}` 
                    : "Loading..."}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Category:</span> {productData?.restaurant?.category?.join(", ") || "Loading..."}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Price Range:</span> {productData?.restaurant?.minPrice && productData?.restaurant?.maxPrice ? 
                    `${productData.restaurant.minPrice} - ${productData.restaurant.maxPrice} đ/person` 
                    : "Loading..."}
                </p>
                <p className={productData?.restaurant?.isOpening ? "text-green-600" : "text-red-600"}>
                  <span className="font-semibold">Status:</span> {productData?.restaurant?.isOpening ? "Open" : "Closed"}
                </p>
              </div>

              <div className="bg-white w-full rounded-lg mt-10 p-6">
                <h2 className="text-2xl font-bold mb-4">Additional Information</h2>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Rating:</h3>
                  <p>{productData?.restaurant?.rating || "No ratings yet"}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Total Rating:</h3>
                  <p>{productData?.restaurant?.totalRating}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Bookings Last Week:</h3>
                  <p>{productData?.restaurant?.numberOfTablesBookedInLastWeek}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Verification Status:</h3>
                  <p>{productData?.restaurant?.isVerified ? "Verified" : "Not Verified"}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Maxim:</h3>
                  <p>{productData?.maxim}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Description:</h3>
                  {productData?.description?.map((desc, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">{desc.title}</h4>
                      <p>{desc.content}</p>
                    </div>
                  ))}
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Schedule:</h3>
                  {productData?.schedule?.map((day, index) => (
                    <p key={index}>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day.dayOfWeek]}:
                      {day.isWorkingDay ? ` ${day.openTime}:00 - ${day.closeTime}:00` : ' Closed'}
                    </p>
                  ))}
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Total Tables:</h3>
                  <p>{productData?.totalTable}</p>
                </section>
              </div>
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