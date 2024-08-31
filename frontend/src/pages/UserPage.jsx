import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUser, logout } from "../store/slice/auth";

export const UserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, accessToken } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userInfo, password: "" });
  const [error, setError] = useState("");

  const [currentView, setCurrentView] = useState("profile");
  const [avatarFile, setAvatarFile] = useState(null);



  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    } else {
      setEditedData({ ...userInfo, password: "" });
    }
  }, [userInfo, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userInfo, password: "" });
    setAvatarFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("file", avatarFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/upload/avatar/${
          userInfo._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        dispatch(updateUser({ avatar: response.data.avatarUrl }));
        setEditedData((prev) => ({ ...prev, avatar: response.data.avatarUrl }));
        setAvatarFile(null);
      } else {
        setError("Failed to upload avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("An error occurred while uploading the avatar.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changedData = { password: editedData.password };
    for (const key in editedData) {
      if (editedData[key] !== userInfo[key] && key !== "password") {
        changedData[key] = editedData[key];
      }
    }

    if (
      Object.keys(changedData).length === 1 &&
      changedData.hasOwnProperty("password") &&
      !changedData.password
    ) {
      setIsEditing(false);
      return;
    }

    try {
      console.log("Sending update request with data:", changedData);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userInfo._id}`,
        changedData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Update response:", response.data);
      if (response.data.success) {
        dispatch(updateUser(changedData));
        setIsEditing(false);
        setError("");
        setEditedData((prev) => ({ ...prev, password: "" }));

        if (avatarFile) {
          await uploadAvatar();
        }
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        navigate("/signin");
      } else {
        setError("An error occurred while updating the profile.");
      }
    }
  };

  const defaultAvatarUrl =
    "https://gamek.mediacdn.vn/133514250583805952/2023/11/15/screenshot60-170003261338138915475.png";

  const renderField = (label, field, type = "text") => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing && field !== "email" ? (
          <input
            type={type}
            name={field}
            value={editedData[field] || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        ) : (
          <p className="text-gray-900">
            {field === "password" ? "********" : editedData[field] || "N/A"}
          </p>
        )}
      </div>
    );
  };

  if (!userInfo) {
    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">No User Data Available</h2>
          <p>Please sign in to view your profile.</p>
          <Link
            to="/signin"
            className="mt-4 inline-block text-red-600 hover:text-red-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
            <h3 className="text-2xl font-semibold">User Profile</h3>
            <div>
              <button
                onClick={() =>
                  setCurrentView(
                    currentView === "profile" ? "updatePassword" : "profile"
                  )
                }
                className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 mr-2"
              >
                {currentView === "profile"
                  ? "Update Password"
                  : "Back to Profile"}
              </button>
              {currentView === "profile" && !isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {currentView === "profile" ? (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mr-6 relative group">
                    <img
                      src={editedData.avatar || defaultAvatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                          w
                            />
                          </svg>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{`${editedData.firstName} ${editedData.lastName}`}</h4>
                    <p className="text-gray-600">
                      {editedData.role
                        ? editedData.role.charAt(0).toUpperCase() +
                          editedData.role.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField("First Name", "firstName")}
                  {renderField("Last Name", "lastName")}
                  {renderField("Email Address", "email")}
                  {renderField("Phone Number", "phone")}
                  {renderField("Gender", "gender")}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <p className="text-gray-900">
                      {editedData.createdAt
                        ? new Date(editedData.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {isEditing && renderField("Password", "password", "password")}

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                {isEditing && (
                  <div className="mt-6 flex justify-end">

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            ) : (

              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="retypeNewPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Retype New Password
                  </label>
                  <input
                  
                    type="password"
                    name="retypeNewPassword"
                    id="retypeNewPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-red-600 hover:text-red-800">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
