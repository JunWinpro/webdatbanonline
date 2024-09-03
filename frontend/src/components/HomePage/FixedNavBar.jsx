import React from "react";
import { Link } from "react-router-dom";
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
                    <NavigationMenuLink key={subIndex} asChild>
                      <Link 
                        to={subItem.link}
                        className={buttonVariants({
                          variant: "defaultt",
                          className: "bg-white",
                        })}
                      >
                        {subItem.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild >
                  <Link
                    to={item.link}
                    className={buttonVariants({ variant: "default" })}
                  >
                    {item.label}
                  </Link>
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