const { default: userAPI } = require("@/api/user")

const userService = {
    register: async (payload) => {
        try {
            const data = await userAPI.register(payload)
            return data
        } catch (error) {
            throw error.response.data.message
        }
    }
}