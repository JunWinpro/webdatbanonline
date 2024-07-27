import React, { useState, useEffect } from "react";
import axios from "axios";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("restaurants");

  const renderContent = () => {
    switch (activeTab) {
      case "restaurants":
        return <RestaurantManagement />;
      case "staff":
        return <StaffManagement />;
      case "bookings":
        return <BookingList />;
      default:
        return <RestaurantManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          {["restaurants", "staff", "bookings"].map((tab) => (
            <button
              key={tab}
              className={`block w-full text-left py-2 px-4 hover:bg-gray-200 ${
                activeTab === tab ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/restaurants`
      );
      if (response.data.success && Array.isArray(response.data.data.data)) {
        setRestaurants(response.data.data.data);
      } else {
        console.error("Received unexpected data structure:", response.data);
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/restaurants/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/restaurants`,
          formData
        );
      }
      fetchRestaurants();
      setFormData({
        name: "",
        address: "",
        category: "",
        minPrice: "",
        maxPrice: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  const handleEdit = (restaurant) => {
    setFormData(restaurant);
    setEditingId(restaurant._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/restaurants/${id}`
      );
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Restaurant Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Restaurant Name"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="number"
          name="minPrice"
          value={formData.minPrice}
          onChange={handleInputChange}
          placeholder="Min Price"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="number"
          name="maxPrice"
          value={formData.maxPrice}
          onChange={handleInputChange}
          placeholder="Max Price"
          className="mr-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Restaurant
        </button>
      </form>

      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Price Range</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {restaurants.map((restaurant) => (
    <tr key={restaurant._id}>
      <td>{restaurant.name}</td>
      <td>{`${restaurant.address.streetAddress}, ${restaurant.address.district}, ${restaurant.address.city}`}</td>
      <td>{restaurant.category.join(", ")}</td>
      <td>{`${restaurant.minPrice || 'N/A'} - ${restaurant.maxPrice || 'N/A'}`}</td>
      <td>
        <button
          onClick={() => handleEdit(restaurant)}
          className="text-blue-500 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(restaurant._id)}
          className="text-red-500"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/staff`
      );
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [streetAddress, district, city] = formData.address.split(", ");
    const dataToSubmit = {
      ...formData,
      address: { streetAddress, district, city },
      category: formData.category.split(", ").map(cat => cat.trim()),
    };
  
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/restaurants/${editingId}`,
          dataToSubmit
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/restaurants`,
          dataToSubmit
        );
      }
      fetchRestaurants();
      setFormData({
        name: "",
        address: "",
        category: "",
        minPrice: "",
        maxPrice: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };
  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      address: `${restaurant.address.streetAddress}, ${restaurant.address.district}, ${restaurant.address.city}`,
      category: restaurant.category.join(", "),
      minPrice: restaurant.minPrice || "",
      maxPrice: restaurant.maxPrice || "",
    });
    setEditingId(restaurant._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Staff Account Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mr-2 p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="mr-2 p-2 border rounded"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Staff
        </button>
      </form>

      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember._id}>
              <td>{`${staffMember.firstName} ${staffMember.lastName}`}</td>
              <td>{staffMember.email}</td>
              <td>{staffMember.role}</td>
              <td>
                <button
                  onClick={() => handleEdit(staffMember)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staffMember._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/bookings`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Booking List</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.restaurantName}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.time}</td>
              <td>{booking.guests}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
