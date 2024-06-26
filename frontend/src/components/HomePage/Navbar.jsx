import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button.jsx";

const Navbar = ({ navItems, username, avatarSrc }) => {
  return (
    <div className="bg-white flex justify-between items-center px-4">

      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item, index) =>
            item.items ? (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.items.map((subItem, subIndex) => (
                    <NavigationMenuLink key={subIndex}>
                      <Button>
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

      <div className="flex items-center text-black">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2">{username}</span>
      </div>
    </div>
  );
};

export default Navbar;