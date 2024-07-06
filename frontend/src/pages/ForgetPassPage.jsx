import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const ForgetPassPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countdown > 0 || isSending) return;

    setIsSending(true);
    try {
      const response = await axios.post('http://localhost:8000/users/forget-password', { email });
      setMessage(response.data.message);
      setIsError(!response.data.success);
      if (response.data.success) {
        setCountdown(90); // Start 1 minute 30 seconds countdown
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
      setIsError(true);
    } finally {
      setIsSending(false);
    }
  };

  const buttonText = () => {
    if (isSending) return 'Sending...';
    if (countdown > 0) return `Resend in ${countdown}s`;
    return 'Send Reset Link';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forget Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            {message && (
              <div className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={countdown > 0 || isSending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  countdown > 0 || isSending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {buttonText()}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Link
                  to="/signin"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Back to Sign In
                </Link>
              </div>
              <div>
                <Link
                  to="/"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};