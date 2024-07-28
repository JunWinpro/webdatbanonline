import React, { useState, useEffect } from "react";
import axios from "axios";
import employeeService from "@/services/employee";

export const ManagerDashboard = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState("restaurants");
  useEffect(() => {
    console.log("AdminDashboard: Component mounted");
  }, []);

  const renderContent = () => {
    if (activeTab === "restaurants") {
      return (
        <RestaurantManagement onSelectRestaurant={setSelectedRestaurant} />
      );
    } else if (selectedRestaurant) {
      switch (activeTab) {
        case "employees":
          return <EmployeesManagement restaurantId={selectedRestaurant._id} />;
        case "bookings":
          return <BookingList restaurantId={selectedRestaurant._id} />;
        default:
          return null;
      }
    } else {
      return <p>Please select a restaurant first.</p>;
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
          <button
            className={`block w-full text-left py-2 px-4 hover:bg-gray-200 ${
              activeTab === "restaurants" ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setActiveTab("restaurants");
              setSelectedRestaurant(null);
            }}
          >
            Restaurants
          </button>
          {selectedRestaurant && (
            <>
              <button
                className={`block w-full text-left py-2 px-4 hover:bg-gray-200 ${
                  activeTab === "employees" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("employees")}
              >
                Employees
              </button>
              <button
                className={`block w-full text-left py-2 px-4 hover:bg-gray-200 ${
                  activeTab === "bookings" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {selectedRestaurant && (
          <h2 className="text-2xl font-semibold mb-4">
            {selectedRestaurant.name}
          </h2>
        )}
        {renderContent()}
      </div>
    </div>
  );
};
const RestaurantManagement = ({ onSelectRestaurant }) => {
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
    const [streetAddress, district, city] = formData.address.split(", ");
    const dataToSubmit = {
      ...formData,
      address: { streetAddress, district, city },
      category: formData.category.split(", ").map((cat) => cat.trim()),
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
        {/* Form fields */}
        {/* ... */}
      </form>

      <table className="w-full text-center">
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
              <td>
                <button
                  onClick={() => onSelectRestaurant(restaurant)}
                  className="text-blue-500 hover:underline"
                >
                  {restaurant.name}
                </button>
              </td>
              <td>{`${restaurant.address.streetAddress}, ${restaurant.address.district}, ${restaurant.address.city}`}</td>
              <td>{restaurant.category.join(", ")}</td>
              <td>{`${restaurant.minPrice || "N/A"} - ${
                restaurant.maxPrice || "N/A"
              }`}</td>
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

const EmployeesManagement = ({ restaurantId }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    username:"",
    phone:"",
    password:"",
    firstName: "",
    lastName: "",
    gender:"",
    restaurantId: restaurantId
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
        const {data, message, success} = await employeeService.getEmployees()
        setEmployees(data.data);
        return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
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
          `${
            import.meta.env.VITE_BACKEND_URL
          }/restaurants/${restaurantId}/employees/${editingId}`,
          formData
        );
      } else {
        const data = await employeeService.createEmployee(formData);
        
        return data;
        console.log(data);
      }
      fetchEmployees();
      setFormData({ username: "", phone:"",password:"",firstName: "", lastName: "", email: "",gender: "",});
      setEditingId(null);
    } catch (error) {
      console.error("Error saving employees member:", error);
    }
  };

  const handleEdit = (employeesMember) => {
    setFormData(employeesMember);
    setEditingId(employeesMember._id);
  };

  const handleDelete = async (id) => {
    try {
      const data = await employeeService.deleteEmployee(id) 

      console.log(data.success)
    } catch (error) {
      console.error("Error deleting employees member:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Employees Management</h2>

      <form onSubmit={handleSubmit} className="mb-8">
      <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="phone"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="password"
          className="mr-2 p-2 border rounded"
        />
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

        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="mr-2 p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Employees
        </button>
      </form>

      <table className="w-full text-center">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
                <tbody>
          {employees.map((employeesMember) => (
            <tr key={employeesMember._id}>
              <td>{`${employeesMember.firstName} ${employeesMember.lastName}`}</td>
              <td>{employeesMember.firstName}</td>
              <td>{employeesMember.lastName}</td>
              <td>
                <button
                  onClick={() => handleEdit(employeesMember)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employeesMember._id)}
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

const BookingList = ({ restaurantId }) => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [restaurantId, currentPage]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/restaurants/${restaurantId}/bookings?page=${currentPage}`
      );
      setBookings(response.data.bookings);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/restaurants/${restaurantId}/bookings/${bookingId}`,
        { status: newStatus }
      );
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Booking List</h2>
      <table className="w-full text-center">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.customerName}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.time}</td>
              <td>{booking.guests}</td>
              <td>{booking.status}</td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                  className="p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
