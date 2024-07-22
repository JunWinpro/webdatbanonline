import authService from "@/services/auth"
import store from "@/store/config"
import { login, logout } from "@/store/slice/auth"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    timeout: import.meta.env.VITE_REQUEST_TIMEOUT || 10000
})
const { auth: { isLogin, accessToken } } = store.getState()

axiosInstance.interceptors.request.use((config) => {
    if (isLogin && accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
})

const refreshAndRetryQueue = []
axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401) {
            if (error.config.url.includes("login")) {
                console.log(error.response.data.message);
                throw error
            }
            else if (error.config.url.includes("renew-access-token")) {
                localStorage.removeItem("refreshToken")
                if (isLogin) store.dispatch(logout())
                throw error
            }
            else {
                const refreshToken = localStorage.getItem("refreshToken")
                if (!refreshToken) {
                    if (isLogin) store.dispatch(logout())
                    throw new Error("Token not found")
                }
                try {
                    const { accessToken, userInfo } = await authService.renewAccessToken(refreshToken)
                    store.dispatch(login({ accessToken, userInfo }))
                    originalRequest.headers["retry"] = true
                } catch (error) {
                    throw error
                }
            }
            return new Promise((resolve, reject) => {
                refreshAndRetryQueue.push({ resolve, reject })
            });
        } else if (originalRequest.headers["retry"]) {
            return Promise.reject(error)
        }
        return Promise.reject(error)
    })



export default axiosInstance