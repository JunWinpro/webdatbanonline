import React from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const Categorybar = ({ restaurants }) => {
  return (
    <>
      <Carousel className="w-5/6 relative my-5">
        <CarouselNext className="absolute top-1/2 -right-10 -translate-y-1/2"></CarouselNext>
        <CarouselPrevious className="absolute top-1/2 -left-10 -translate-y-1/2"></CarouselPrevious>
        <CarouselContent className="w-full flex-nowrap">
          {restaurants.map((restaurant) => (
            <CarouselItem key={restaurant._id} className="ml-10 md:basis-1/8 lg:basis-1/8 py-2">
              <Link to={`/product/${restaurant._id}`}>
                <Card 
                  hoverable
                  style={{ width: 200 }}
                  cover={
                    <div className="h-48 overflow-hidden  ">
                      <img
                        alt={restaurant.name}
                        src={restaurant.avatar || "https://via.placeholder.com/200"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  }
                >
                  <Meta className="p-0"
                    title={restaurant.name}
                    description={
                      <span style={{ color: "red" }}>
                        {restaurant.minPrice && restaurant.maxPrice
                          ? `${restaurant.minPrice}K - ${restaurant.maxPrice}K`
                          : "Price not available"}
                      </span>
                    }
                  />
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default Categorybar;