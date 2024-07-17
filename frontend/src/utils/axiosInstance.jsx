import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:8000/users/renew-access-token', {
          refreshToken,
        });

        if (response.data.success) {
          localStorage.setItem('accessToken', response.data.data.accessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;