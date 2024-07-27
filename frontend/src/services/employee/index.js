import employeeAPI from "@/api/employee"

const employeeService = {
    getEmployees: async (query) => {
        try {
            const data = await employeeAPI.getEmployees(query)
            return data.employees
        } catch (error) {
            throw error.response?.data?.message || error.message
        }
    },
    getEmployeeById: async (_id) => {
        try {
            const data = await employeeAPI.getEmployeeById(_id)
            return data.employee 
        } catch (error) {
            throw error.response?.data?.message || error.message
        }
    },
    createEmployee: async (payload) => {
        try {
            const data = await employeeAPI.createEmployee(payload)
            return data.employee 
        } catch (error) {
            throw error.response?.data?.message || error.message
        }
    },
    updateEmployee: async (payload) => {
        try {
            const data = await employeeAPI.updateEmployee(payload)
            return data.employee
        } catch (error) {
            throw error.response?.data?.message || error.message
        }
    },
    deleteEmployee: async (_id) => {
        try {
            const data = await employeeAPI.deleteEmployee(_id)
            return data.success
        } catch (error) {
            throw error.response?.data?.message || error.message
        }
    },
    
    login: async (credentials) => {
        try {
          const data = await employeeAPI.login(credentials)
          return data
        } catch (error) {
          throw error.response?.data?.message || error.message
        }
      },
    }
    

export default employeeService