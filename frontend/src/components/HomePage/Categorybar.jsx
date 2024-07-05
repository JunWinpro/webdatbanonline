import React from "react";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const categoryData = [
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/a2cc4701-0953-4462-81d5-4e0f3ed74fed.webp?Width=250&Type=webp",
    title: "Buffet Liberty Level 9 – Phạm Ngũ Lão",
    description: "Giảm tới 15%",
  },
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/18386186-9c30-423b-8b1d-ef6087ce46ba.webp?Width=250&Type=webp",
    title: "Buffet Cửu Vân Long Premium - Bitexco Financial",
    description: "Ưu đãi hấp dẫn",
  },
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/d37b2a2d-ce96-44b8-bbb8-e1a5aab1056a.webp?Width=250&Type=webp",
    title: "D’Maris - Cộng Hòa",
    description: "Giảm 10%",
  },
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/a2cc4701-0953-4462-81d5-4e0f3ed74fed.webp?Width=250&Type=webp",
    title: "Buffet Liberty Level 9 – Phạm Ngũ Lão",
    description: "Giảm tới 15%",
  },
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/18386186-9c30-423b-8b1d-ef6087ce46ba.webp?Width=250&Type=webp",
    title: "Buffet Cửu Vân Long Premium - Bitexco Financial",
    description: "Ưu đãi hấp dẫn",
  },
  {
    imageUrl: "https://storage.pasgo.com.vn/PasGoGianHang/d37b2a2d-ce96-44b8-bbb8-e1a5aab1056a.webp?Width=250&Type=webp",
    title: "D’Maris - Cộng Hòa",
    description: "Giảm 10%",
  },

];


const Categorybar = () => {
  return (
    <>
      <Carousel className="w-5/6 relative my-5">
        <CarouselNext className="absolute top-1/2 -right-10 -translate-y-1/2"></CarouselNext>
        <CarouselPrevious className="absolute top-1/2 -left-10 -translate-y-1/2"></CarouselPrevious>
        <CarouselContent className="w-full flex-nowrap">
          {categoryData.map((category, index) => (
            <CarouselItem key={index} className="ml-10 md:basis-1/8 lg:basis-1/8">
              <Card
                hoverable
                style={{ width: 200 }}
                cover={<img alt={category.title} src={category.imageUrl} />}
              >
                <Meta
                  title={category.title}
                  description={
                    <span style={{ color: "red" }}>{category.description}</span>
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