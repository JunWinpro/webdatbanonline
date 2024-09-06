import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateRestaurantPage = () => {
  const navigate = useNavigate();
  const { userInfo, accessToken, isLogin } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    address: {
      streetAddress: '',
      district: '',
      city: ''
    },
    category: [],
    totalTable: 0,
    description: [{ title: '', content: '' }],
    schedule: Array(7).fill().map((_, i) => ({
      dayOfWeek: i,
      isWorkingDay: i > 0 && i < 6,
      openTime: i > 0 && i < 6 ? 8 : 23,
      closeTime: i > 0 && i < 6 ? 21 : 23.99
    }))
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesData = await import('../cities.json');
        const districtsData = await import('../districts.json');
        setCities(citiesData.default);
        setDistricts(districtsData.default);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.address.city) {
      const filtered = districts.filter(district => district.parent_code === formData.address.city);
      setFilteredDistricts(filtered);
      setFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          district: ''
        }
      }));
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.address.city, districts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'streetAddress' || name === 'district' || name === 'city') {
      setFormData(prevState => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      category: checked 
        ? [...prevState.category, value]
        : prevState.category.filter(cat => cat !== value)
    }));
  };

  const handleDescriptionChange = (index, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      description: prevState.description.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      schedule: prevState.schedule.map((item, i) => 
        i === index ? { ...item, [field]: field === 'isWorkingDay' ? value : Number(value) } : item
      )
    }));
  };

  
  useEffect(() => {
    if (!isLogin || !accessToken) {
      navigate('/signin');
    }
  }, [isLogin, accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/restaurants', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Restaurant created:', response.data);
      navigate('/admin/restaurants');
    } catch (error) {
      console.log(formData)
      console.error('Error creating restaurant:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            console.log('Unauthorized or Forbidden. Redirecting to login.');
            navigate('/signin');
            break;
          default:
            console.log('An error occurred while creating the restaurant.');
        }
      } else {
        console.log('Network error or server is not responding.');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div>
              <h1 className="text-3xl font-semibold text-center mb-10">Create New Restaurant</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.address.streetAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <select
                    name="city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <select
                    name="district"
                    value={formData.address.district}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a district</option>
                    {filteredDistricts.map(district => (
                      <option key={district.code} value={district.code}>{district.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tables</label>
                  <input
                    type="number"
                    name="totalTable"
                    value={formData.totalTable}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <div className="mt-2 space-y-2">
                    {['buffet', 'grill', 'fastfood', 'finedining'].map(cat => (
                      <div key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          id={cat}
                          value={cat}
                          checked={formData.category.includes(cat)}
                          onChange={handleCategoryChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={cat} className="ml-2 block text-sm text-gray-900 capitalize">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {formData.description.map((desc, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={desc.title}
                      onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <textarea
                      placeholder="Content"
                      value={desc.content}
                      onChange={(e) => handleDescriptionChange(index, 'content', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    description: [...prev.description, { title: '', content: '' }]
                  }))}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Description
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.schedule.map((day, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</span>
                        <input
                          type="checkbox"
                          checked={day.isWorkingDay}
                          onChange={(e) => handleScheduleChange(index, 'isWorkingDay', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <input
                        type="number"
                        value={day.openTime}
                        onChange={(e) => handleScheduleChange(index, 'openTime', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        min="0"
                        max="23"
                        placeholder="Open"
                      />
                      <input
                        type="number"
                        value={day.closeTime}
                        onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        min="0"
                        max="23.99"
                        step="0.01"
                        placeholder="Close"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurantPage;