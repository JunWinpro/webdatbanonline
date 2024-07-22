import axiosInstance from "../axios"

const basePath = "/users"
const userAPI = {
    register: async (payload) => {
        try {
            const { data } = await axiosInstance.post(`${basePath}/register`, payload)
            return data
        } catch (error) {
            throw error
        }
    },
    getUsers: async (query) => {
        try {
            const { data } = await axiosInstance.get(`${basePath}/?${query}`)
            return data
        } catch (error) {
            throw error
        }
    },
    getUserById: async (_id) => {
        try {
            const { data } = await axiosInstance.get(`${basePath}/${_id}`)
            return data
        } catch (error) {
            throw error
        }
    },
    updateUser: async (payload) => {
        try {
            const { _id } = payload._id
            const { data } = await axiosInstance.put(`${basePath}/${_id}`, payload)
            return data
        } catch (error) {
            throw error
        }
    }
}

export default userAPI