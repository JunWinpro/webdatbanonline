import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

const Navbar = ({ navItems, currentUser, onSignOut, updateUserAvatar }) => {
  const navigate = useNavigate();
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
  };

  const handleAvatarChange = () => {
    if (newAvatarUrl) {
      updateUserAvatar(newAvatarUrl);
      setIsChangingAvatar(false);
      setNewAvatarUrl("");
    }
  };

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
        {currentUser ? (
          <>
            <Avatar>
              <AvatarImage
                src={
                  currentUser.avatar ||
                  "https://gamek.mediacdn.vn/133514250583805952/2023/11/15/screenshot60-170003261338138915475.png"
                }
              />
              <AvatarFallback>
                {currentUser.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="ml-2 cursor-pointer">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsChangingAvatar(true)}>
                  Change Avatar
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isChangingAvatar && (
              <div className="ml-4">
                <input
                  type="text"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  placeholder="New avatar URL"
                  className="mr-2 p-1 border rounded"
                />
                <Button onClick={handleAvatarChange}>Update Avatar</Button>
              </div>
            )}
          </>
        ) : (
          <div>
            <Button>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
