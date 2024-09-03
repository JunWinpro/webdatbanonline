import React, { useState, useEffect } from "react";
import Banner from "@/components/HomePage/Banner";
import Categorybar from "@/components/HomePage/Categorybar";
import FilterHome from "@/components/HomePage/FilterHome";
import TitleBar from "@/components/HomePage/TitleBar";
import axios from "axios";

export const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants`);
        if (response.data.success) {
          setRestaurants(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const restaurantChunks = chunkArray(restaurants, 7);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <FilterHome />
      {restaurantChunks.map((chunk, index) => (
        <React.Fragment key={index}>
          <TitleBar title={`Featured Restaurants ${index + 1}`} />
          <Categorybar restaurants={chunk} />
        </React.Fragment>
      ))}
      <Banner />
    </>
  );
};