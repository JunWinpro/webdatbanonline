import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminRestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurants");
      setRestaurants(response.data.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching restaurants");
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) return <div className="flex justify-center items-center h-screen"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Restaurant Management</h1>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img className="h-12 w-12 rounded-full object-cover" src={restaurant.image} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`${restaurant.address.streetAddress}, ${restaurant.address.city}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {restaurant.category.join(", ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`$${restaurant.minPrice} - $${restaurant.maxPrice}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/restaurants/${restaurant._id}/employees`} className="text-indigo-600 hover:text-indigo-900">
                    Manage Employees
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRestaurantList;