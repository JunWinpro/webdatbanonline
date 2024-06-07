import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button.jsx";

const foodAndDrinkItems = [
  { label: "Restaurant", link: "/restaurant" },
  { label: "Hotpot", link: "/hotpot" },
  { label: "Cafe", link: "/cafe" },
  { label: "Bar", link: "/bar" },
  { label: "Grilled food", link: "/grilled-food" },
];

const Navbar = () => {
  return (
    <div className="bg-white">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink>
              <Button>
                <Link to="/">Home</Link>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink as={Link} to="/contact">
              <Button>
                <Link to="/contact">Contact</Link>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Food & Drink</NavigationMenuTrigger>
            <NavigationMenuContent>
              {foodAndDrinkItems.map((item) => (
                <NavigationMenuLink>
                  <Button>
                    <Link to={item.link}>{item.label}</Link>
                  </Button>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
