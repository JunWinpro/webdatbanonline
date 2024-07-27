import axiosInstance from "../axios"

const authAPI = {
    login: async (payload) => {
        try {
            const { data } = await axiosInstance.post("/users/login", payload)
            return data
        } catch (error) {
            throw error
        }
    },
    renewAccessToken: async (payload) => {
        try {
            const { data } = await axiosInstance.post("/renew-access-token", {
                refreshToken: payload
            })
            return data
        } catch (error) {
            throw error
        }
    }
}

export default authAPI