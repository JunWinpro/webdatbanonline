import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PlacesItems = [
  { label: "Quận 1", link: "quan-1" },
  { label: "Quận 2", link: "quan-2" },
  { label: "Quận 3", link: "quan-3" },
  { label: "Quận 4", link: "quan-4" },
  { label: "Quận 5", link: "quan-5" },
  { label: "Quận 6", link: "quan-6" },
  { label: "Quận 7", link: "quan-7" },
  { label: "Quận 8", link: "quan-8" },
  { label: "Quận 9", link: "quan-9" },
  { label: "Quận 10", link: "quan-10" },
  { label: "Quận 11", link: "quan-11" },
  { label: "Quận 12", link: "quan-12" },
  { label: "Bình Thạnh", link: "binh-thanh" },
  { label: "Thủ Đức", link: "thu-duc" },
  { label: "Gò Vấp", link: "go-vap" },
  { label: "Tân Bình", link: "tan-binh" },
  { label: "Tân Phú", link: "tan-phu" },
  { label: "Phú Nhuận", link: "phu-nhuan" },
  { label: "Bình Tân", link: "binh-tan" },
  { label: "Hóc Môn", link: "hoc-mon" },
  { label: "Củ Chi", link: "cu-chi" },
  { label: "Bình Chánh", link: "binh-chanh" },
  { label: "Cần Giờ", link: "can-gio" },
  { label: "Nhà Bè", link: "nha-be" },
];

const TypeItems = [
    { label: "Restaurant", link: "restaurant" },
  ];

const FilterHome = () => {
  return (
    <>
      <Carousel>
        <CarouselContent>
          <CarouselItem className="md:basis-1/2 lg:basis-1/5">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a places" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Places</SelectLabel>
                  {PlacesItems.map((item) => (
                    <SelectItem value={item.link}>{item.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/5">
          <Select>
          <SelectTrigger>
            <SelectValue placeholder="Restaurant" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              {TypeItems.map((item) => (
                <SelectItem value={item.link}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/5">
          <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a places" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Places</SelectLabel>
              {PlacesItems.map((item) => (
                <SelectItem value={item.link}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

          </CarouselItem>

          <CarouselItem className="md:basis-1/2 lg:basis-1/5">
          <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a places" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Places</SelectLabel>
              {PlacesItems.map((item) => (
                <SelectItem value={item.link}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-around">

      </div>
    </>
  );
};

export default FilterHome;
