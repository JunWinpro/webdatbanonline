import authService from "@/services/auth"
import store from "@/store/config"
import { login, logout } from "@/store/slice/auth"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    timeout: import.meta.env.VITE_REQUEST_TIMEOUT || 10000
})

axiosInstance.interceptors.request.use((config) => {
    const { auth: { isLogin, accessToken } } = store.getState()
    if (isLogin && accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401) {
            if (error.config.url.includes("login")) {
                throw error
            }
            else if (error.config.url.includes("renew-access-token")) {
                const { auth: { isLogin } } = store.getState()
                localStorage.removeItem("refreshToken")
                if (isLogin) store.dispatch(logout())
                throw error
            }
            else {
                try {
                    const refreshToken = localStorage.getItem("refreshToken")
                    if (!refreshToken) {
                        const { auth: { isLogin } } = store.getState()
                        if (isLogin) store.dispatch(logout())
                        throw new Error("Token not found")
                    }
                    const { accessToken, userInfo } = await authService.renewAccessToken(refreshToken)
                    store.dispatch(login({ accessToken, userInfo }))
                    originalRequest.headers["retry"] = true
                    return axiosInstance(originalRequest)
                } catch (error) {
                    throw error
                }
            }
        } else if (originalRequest.headers["retry"]) {
            return Promise.reject(error)
        }
        return Promise.reject(error)
    })



export default axiosInstance