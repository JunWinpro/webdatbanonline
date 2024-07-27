import axiosInstance from "../axios"

const basePath = "/employees"
const employeeAPI = {
    getEmployees: async (query) => {
        try {
            const { data } = await axiosInstance.get(`${basePath}/?${query}`)
            return data
        } catch (error) {
            throw error
        }
    },
    getEmployeeById: async (_id) => {
        try {
            const { data } = await axiosInstance.get(`${basePath}/${_id}`)
            return data
        } catch (error) {
            throw error
        }
    },
    createEmployee: async (payload) => {
        try {
            const { data } = await axiosInstance.post(`${basePath}`, payload)
            return data
        } catch (error) {
            throw error
        }
    },
    updateEmployee: async (payload) => {
        try {
            const { _id } = payload
            const { data } = await axiosInstance.put(`${basePath}/${_id}`, payload)
            return data
        } catch (error) {
            throw error
        }
    },
    deleteEmployee: async (_id) => {
        try {
            const { data } = await axiosInstance.delete(`${basePath}/${_id}`)
            return data
        } catch (error) {
            throw error
        }
    },  login: async (credentials) => {
        try {
          const { data } = await axiosInstance.post(`${basePath}/login`, credentials)
          return data
        } catch (error) {
          throw error
        }
      },
    }
    
export default employeeAPI