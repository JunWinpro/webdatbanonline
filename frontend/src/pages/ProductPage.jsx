import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import BookingBanner from "@/components/ProductPage/BookingBanner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";

export const ProductPage = () => {
  const { id } = useParams();
  const [bookingStatus, setBookingStatus] = useState(null);
  const { isLogin, userInfo } = useSelector((state) => state.auth);
  const [productData, setProductData] = useState(null);
  const [isFloating, setIsFloating] = useState(false);
  const [arrivingDateTime, setArrivingDateTime] = useState(
    setHours(setMinutes(new Date(), 0), 12)
  );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/restaurants/restaurant/${id}`
        );
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

  const handleBookingSubmit = async () => {
    if (!isLogin) {
      setBookingStatus("Please sign in to make a booking.");
      return;
    }
    const bookingData = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phone: userInfo.phone,
      restaurantId: id,
      info: [
        {
          tableNumber: 1,
          menu: [],
        },
      ],
      checkinTime: arrivingDateTime.getTime(),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setBookingStatus("Booking successful!");
    } catch (error) {
      console.error("Error making booking:", error);
      setBookingStatus("Error making booking. Please try again.");
    }
  };

  const bookingTable = (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Booking Table</h2>
      <p className="mb-4">Please select your booking details:</p>
      <div className="mb-4">
        <label className="block mb-2">Arriving Date and Time</label>
        <DatePicker
          selected={arrivingDateTime}
          onChange={(date) => setArrivingDateTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
          minTime={setHours(setMinutes(new Date(), 0), 8)}
          maxTime={setHours(setMinutes(new Date(), 30), 20)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mt-2">
        <button
          onClick={handleBookingSubmit}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Book now
        </button>
      </div>
      {bookingStatus && (
        <p
          className={`mt-2 text-center ${
            bookingStatus.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {bookingStatus}
        </p>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-slate-100">
        <div className="w-full flex justify-center">
          <BookingBanner images={productData?.restaurantImages || []} />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-7/12 flex justify-end">
            <div className=" w-11/12 rounded-lg">
              <div className="bg-white w-full rounded-lg p-6">
                <h1 className="text-3xl font-semibold mb-2">
                  {productData?.restaurant?.name || "Loading..."}
                </h1>
                <p className="text-lg mb-2">
                  {productData?.restaurant?.address
                    ? `${productData.restaurant.address.streetAddress}, ${productData.restaurant.address.district}, ${productData.restaurant.address.city}`
                    : "Loading..."}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {productData?.restaurant?.category?.join(", ") ||
                    "Loading..."}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Price Range:</span>{" "}
                  {productData?.restaurant?.minPrice &&
                  productData?.restaurant?.maxPrice
                    ? `${productData.restaurant.minPrice} - ${productData.restaurant.maxPrice} đ/person`
                    : "Loading..."}
                </p>
                <p
                  className={
                    productData?.restaurant?.isOpening
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  <span className="font-semibold">Status:</span>{" "}
                  {productData?.restaurant?.isOpening ? "Open" : "Closed"}
                </p>
              </div>

              <div className="bg-white w-full rounded-lg mt-10 p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Additional Information
                </h2>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Rating:</h3>
                  <p>{productData?.restaurant?.rating || "No ratings yet"}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Total Rating:</h3>
                  <p>{productData?.restaurant?.totalRating}</p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Bookings Last Week:
                  </h3>
                  <p>
                    {productData?.restaurant?.numberOfTablesBookedInLastWeek}
                  </p>
                </section>

                <section className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Verification Status:
                  </h3>
                  <p>
                    {productData?.restaurant?.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </p>
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
                      {
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][day.dayOfWeek]
                      }
                      :
                      {day.isWorkingDay
                        ? ` ${day.openTime}:00 - ${day.closeTime}:00`
                        : " Closed"}
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
