import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

const Navbar = ({ navItems }) => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useContext(UserContext);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [error, setError] = useState("");

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleAvatarChange = async () => {
    if (newAvatarUrl) {
      try {
        const response = await axiosInstance.put(`/users/${user._id}`, {
          avatar: newAvatarUrl,
        });
        if (response.data.success) {
          await updateUser({ ...user, avatar: newAvatarUrl });
          setIsChangingAvatar(false);
          setNewAvatarUrl("");
          setError("");
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
        setError("Failed to update avatar. Please try again.");
      }
    }
  };

  const defaultAvatarUrl =
    "https://gamek.mediacdn.vn/133514250583805952/2023/11/15/screenshot60-170003261338138915475.png";

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
        {user ? (
          <>
            <Avatar>
              <AvatarImage src={user.avatar || defaultAvatarUrl} />
              <AvatarFallback>
                {user.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="ml-2 cursor-pointer">{`${user.firstName} ${user.lastName}`}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
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
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div>
            <Button className="mr-2">
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
