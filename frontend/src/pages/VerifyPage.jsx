import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const VerifyPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/users/verify-user/${token}`
        );
        console.log(responseD)
        if (response.data.success === true) {
          setSuccess('User verified successfully!');
          startCountdown();
        } else {

          setError('Failed to verify user. Please try again.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [token, navigate]);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/signin');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 font-comic-sans">
      <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md w-11/12">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Verifying your account...</p>
          </>
        ) : error ? (
          <div className="text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-xl">{error}</p>
          </div>
        ) : (
          <div className="text-green-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xl mb-2">{success}</p>
            <p className="text-lg">Redirecting to login in {countdown} seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};