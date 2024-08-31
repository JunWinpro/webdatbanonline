import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiPieChart, FiSettings } from 'react-icons/fi';

const DashboardCard = ({ title, icon: Icon, link, description }) => (
  <Link to={link} className="block w-full sm:w-64 m-4">
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-6">
      <Icon className="text-5xl mb-4 text-blue-500" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  </Link>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`rounded-full p-3 mr-4 ${color}`}>
      <Icon className="text-white text-2xl" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const totalUsers = 1234;
  const totalRestaurants = 56;
  const totalBookings = 789;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
        
        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={totalUsers} icon={FiUsers} color="bg-blue-500" />
          <StatCard title="Total Restaurants" value={totalRestaurants} icon={FiHome} color="bg-green-500" />
          <StatCard title="Total Bookings" value={totalBookings} icon={FiPieChart} color="bg-purple-500" />
        </div>
        
        {/* Main Navigation Cards */}
        <div className="flex flex-wrap justify-center items-stretch">
          <DashboardCard 
            title="User Management" 
            icon={FiUsers} 
            link="/admin/users" 
            description="View and manage user accounts, roles, and permissions."
          />
          <DashboardCard 
            title="Restaurant Management" 
            icon={FiHome} 
            link="/admin/restaurants" 
            description="Add, edit, and manage restaurant listings and details."
          />
          <DashboardCard 
            title="Booking Analytics" 
            icon={FiPieChart} 
            link="/admin/analytics" 
            description="View booking statistics and performance metrics."
          />
          <DashboardCard 
            title="System Settings" 
            icon={FiSettings} 
            link="/admin/settings" 
            description="Configure global settings and preferences for the platform."
          />
        </div>
      </div>
    </div>
  );
};