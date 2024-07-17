import React, { useState, useEffect } from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const Categorybar = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:8000/restaurants");
        if (response.data.success) {
          setRestaurants(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <Carousel className="w-5/6 relative my-5">
        <CarouselNext className="absolute top-1/2 -right-10 -translate-y-1/2"></CarouselNext>
        <CarouselPrevious className="absolute top-1/2 -left-10 -translate-y-1/2"></CarouselPrevious>
        <CarouselContent className="w-full flex-nowrap">
          {restaurants.map((restaurant) => (
            <CarouselItem key={restaurant._id} className="ml-10 md:basis-1/8 lg:basis-1/8">
              <Card
                hoverable
                style={{ width: 200 }}
                cover={
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={restaurant.name}
                      src={restaurant.avatar || "https://via.placeholder.com/200"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                }
              >
                <Meta
                  title={restaurant.name}
                  description={
                    <span style={{ color: "red" }}>
                      {restaurant.minPrice && restaurant.maxPrice
                        ? `${restaurant.minPrice}$ - ${restaurant.maxPrice}$`
                        : "Price not available"}
                    </span>
                  }
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default Categorybar;