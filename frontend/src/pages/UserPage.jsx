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
  const [currentLink, setCurrentLink] = useState("profile");
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
    formData.append('file', avatarFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/upload/avatar/${userInfo._id}`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        dispatch(updateUser({ avatar: response.data.avatarUrl }));
        setEditedData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
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

  function renderField(label, field, type = "text") {
    return (
      <div
        className={`bg-${
          field === "email" ? "gray-50" : "white"
        } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
      >
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {isEditing && field !== "email" ? (
            <input
              type={type}
              name={field}
              value={editedData[field] || ""}
              onChange={handleChange}
              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          ) : field === "password" ? (
            "********"
          ) : (
            editedData[field] || "N/A"
          )}
        </dd>
      </div>
    );
  }

  const changeLink = (status) => {
    setCurrentLink(status);
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

  if (currentLink === "profile") {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-red-600 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              User Profile
            </h3>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => changeLink("updatePassword")}
              className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
            >
              Update password
            </button>
          </div>
          <div className="border-t border-gray-200">
            <form onSubmit={handleSubmit}>
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                  <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 relative">
                    <div className="ml-10 w-40 h-40 rounded-full overflow-hidden relative group">
                      <img
                        src={editedData.avatar || defaultAvatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={uploadAvatar}
                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Upload New Avatar
                      </button>
                    )}
                  </dd>
                </div>
                {renderField("First name", "firstName")}
                {renderField("Last name", "lastName")}
                {renderField("Email address", "email")}
                {renderField("Phone number", "phone")}
                {renderField("Gender", "gender")}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editedData.role
                      ? editedData.role.charAt(0).toUpperCase() +
                        editedData.role.slice(1)
                      : "N/A"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Account created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editedData.createdAt
                      ? new Date(editedData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </dd>
                </div>
                {renderField("Password", "password", "password")}
              </dl>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {isEditing && (
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-red-600 hover:text-red-800">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (currentLink === "updatePassword") {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-red-600 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              Update Password
            </h3>
            <button
              onClick={() => changeLink("profile")}
              className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
            >
              Back to Profile
            </button>
          </div>
          <div className="border-t border-gray-200 p-6">
            <form className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="retypeNewPassword" className="block text-sm font-medium text-gray-700">
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
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-red-600 hover:text-red-800">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }
};