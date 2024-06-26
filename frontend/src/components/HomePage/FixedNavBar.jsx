import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/fixed-navigation-menu";
import { Button, buttonVariants } from "../ui/fixed-button.jsx";

const FixedNavBar = ({ navItems, username }) => {
  return (
    <div className="bg-red-600 flex justify-between items-center px-4">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item, index) =>
            item.items ? (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.items.map((subItem, subIndex) => (
                    <NavigationMenuLink key={subIndex}>
                      <Button
                        className={buttonVariants({
                          className: "bg-white text-black",
                        })}
                      >
                        <Link to={subItem.link}>{subItem.label}</Link>
                      </Button>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink>
                  <Button>
                    <Link to={item.link}>{item.label}</Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
      

    </div>
  );
};

export default FixedNavBar;