import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FiSearch } from "react-icons/fi";

const AdminEmployeeList = () => {
  const { restaurantId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [restaurantId]);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get(`/restaurants/${restaurantId}/employees`);
      setEmployees(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching employees");
      setLoading(false);
    }
  };

  const changeRole = async (employeeId, newRole) => {
    try {
      await axiosInstance.put(`/restaurants/${restaurantId}/employees/${employeeId}`, {
        role: newRole,
      });
      fetchEmployees();
    } catch (err) {
      setError("Error changing employee role");
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) return <div className="flex justify-center items-center h-screen"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline"> {error}</span></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Employee Management</h1>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {employee.avatar ? (
                        <img className="h-12 w-12 rounded-full object-cover" src={employee.avatar} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-xl font-medium text-white">{employee.firstName[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {employee.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => changeRole(employee._id, e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Change Role</option>
                    <option value="waiter">Waiter</option>
                    <option value="chef">Chef</option>
                    <option value="manager">Manager</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployeeList;