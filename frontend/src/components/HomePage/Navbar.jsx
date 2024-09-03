import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { updateUser, logout } from "../../store/slice/auth";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "../ui/button.jsx";
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
  const dispatch = useDispatch();
  const { isLogin, userInfo } = useSelector((state) => state.auth);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [error, setError] = useState("");
  console.log(userInfo, isLogin);
  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAvatarChange = async () => {
    if (newAvatarUrl) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/userInfos/${userInfo._id}`,
          { avatar: newAvatarUrl },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data.success) {
          dispatch(updateUser({ avatar: newAvatarUrl }));
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
                    <NavigationMenuLink key={subIndex} asChild>
                      <Link
                        to={subItem.link}
                        className={buttonVariants({ variant: "default" })}
                      >
                        {subItem.label}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
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

      <div className="flex items-center text-black">
        {isLogin ? (
          <>
            <Avatar>
              {userInfo && userInfo.avatar ? (
                <AvatarImage src={userInfo.avatar} />
              ) : (
                <AvatarFallback>
                  {userInfo && userInfo.firstName
                    ? userInfo.firstName.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              )}
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="ml-2 cursor-pointer">
                  {userInfo
                    ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`
                    : "User"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>User Info</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                {userInfo && userInfo.role === "admin" && (
                  <DropdownMenuItem onSelect={() => navigate("/admin")}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                {userInfo && userInfo.role === "manager" && (
                  <DropdownMenuItem onSelect={() => navigate("/manager")}>
                    Manager Dashboard
                  </DropdownMenuItem>
                )}
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
