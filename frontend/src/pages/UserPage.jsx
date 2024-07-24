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
  const [editedData, setEditedData] = useState({ ...userInfo, password: '' });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    } else {
      setEditedData({ ...userInfo, password: '' });
    }
  }, [userInfo, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...userInfo, password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changedData = { password: editedData.password };
    for (const key in editedData) {
      if (editedData[key] !== userInfo[key] && key !== 'password') {
        changedData[key] = editedData[key];
      }
    }

    if (Object.keys(changedData).length === 1 && changedData.hasOwnProperty('password') && !changedData.password) {
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
        setEditedData(prev => ({ ...prev, password: '' }));
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

  function renderField(label, field, type = "text") {
    return (
      <div className={`bg-${field === "email" ? "gray-50" : "white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
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
        </div>
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
                <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                  <img
                    src={editedData.avatar || defaultAvatarUrl}
                    alt="User Avatar"
                    className="ml-10 w-40 h-40 rounded-full"
                  />
                </dd>
              </div>
              {renderField("First name", "firstName")}
              {renderField("Last name", "lastName")}
              {renderField("Email address", "email")}
              {renderField("Phone number", "phone")}
              {renderField("Gender", "gender")}
              {renderField("Password", "password", "password")}

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editedData.role
                    ? editedData.role.charAt(0).toUpperCase() + editedData.role.slice(1)
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
};