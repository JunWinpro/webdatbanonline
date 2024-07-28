import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const VerifyPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/verify-user/${token}`
      );

      if (response.data.success) {
        setSuccess('Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/signin'), 3000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
    navigate('/login');
  };
  handleSubmit()
  return (

    <a> </a>
  );
};