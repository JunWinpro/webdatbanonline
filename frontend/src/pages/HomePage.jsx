import React, { useState, useEffect, useCallback } from "react";
import Banner from "@/components/HomePage/Banner";
import Categorybar from "@/components/HomePage/Categorybar";
import FilterHome from "@/components/HomePage/FilterHome";
import TitleBar from "@/components/HomePage/TitleBar";
import axios from "axios";
import { useSearch } from "@/components/HomePage/SearchContent";

const capitalizeWords = (str) => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const groupRestaurantsByCategory = (restaurants) => {
  return restaurants.reduce((acc, restaurant) => {
    const categories = Array.isArray(restaurant.category) ? restaurant.category : [restaurant.category || 'Uncategorized'];
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(restaurant);
    });
    return acc;
  }, {});
};

export const HomePage = () => {
  const [restaurantsByCategory, setRestaurantsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasSearched, results, searchTerm } = useSearch();

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/restaurants`);
      if (response.data.success) {
        const groupedRestaurants = groupRestaurantsByCategory(response.data.data.data);
        setRestaurantsByCategory(groupedRestaurants);
      } else {
        throw new Error("Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to fetch restaurants. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const categories = Object.keys(restaurantsByCategory);

  return (
    <>
      <FilterHome />
      
      {categories.map(category => {
        const restaurantsInCategory = restaurantsByCategory[category];
        const chunkedRestaurants = chunkArray(restaurantsInCategory, 7);
        return (
          <React.Fragment key={category}>
            <TitleBar 
              title={`${capitalizeWords(category)} Restaurants`} 
              description={`Explore our selection of ${category.toLowerCase()} restaurants`}
            />
            {chunkedRestaurants.map((chunk, index) => (
              <Categorybar key={`${category}-${index}`} restaurants={chunk} />
            ))}
          </React.Fragment>
        );
      })}
      <Banner />
    </>
  );
};