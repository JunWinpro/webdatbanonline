import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const UserPage = ({ currentUser, updateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(currentUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(userInfo);
    setIsEditing(false);
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="flex items-center mb-4">
        <Avatar className="h-24 w-24 mr-4">
          <AvatarImage
            src={
              currentUser.avatar ||
              "https://gamek.mediacdn.vn/133514250583805952/2023/11/15/screenshot60-170003261338138915475.png"
            }
            alt={currentUser.firstName}
          />
          <AvatarFallback>

            {currentUser.firstName[0]}
            {currentUser.lastName[0]}

          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{`${currentUser.firstName} ${currentUser.lastName}`}</h2>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              name="avatar"
              value={userInfo.avatar}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {currentUser.phone}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(currentUser.dateOfBirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Gender:</strong> {currentUser.gender}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${currentUser.address.streetAddress}, ${currentUser.address.district}, ${currentUser.address.city}`}
          </p>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};

export default UserPage;
