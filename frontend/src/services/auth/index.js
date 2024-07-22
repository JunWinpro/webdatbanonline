import authAPI from "@/api/auth";

const authService = {
    login: async (payload) => {
        try {
            const data = await authAPI.login(payload)
            if (data.data) {
                return data.data
            }
        } catch (error) {
            throw error.response.data.message
        }
    },
    renewAccessToken: async (payload) => {
        try {
            const data = await authAPI.renewAccessToken(payload)
            const { accessToken, userInfo } = data.data
            return { accessToken, userInfo }
        } catch (error) {
            throw error
        }
    }
}

export default authService;