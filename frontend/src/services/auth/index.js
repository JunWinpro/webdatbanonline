import authAPI from "@/api/auth";

const authService = {
    login: async (payload) => {
        try {
            const data = await authAPI.login(payload)
            if (data.data) {
                const { accessToken, refreshToken, userInfo, role } = data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                return { userInfo, role };
            }
        } catch (error) {
            throw error.response.data.message
        }
    },
    renewAccessToken: async (payload) => {
        try {
            const data = await authAPI.renewAccessToken(payload)
            const { accessToken, userInfo, role } = data.data
            localStorage.setItem("accessToken", accessToken);
            return { accessToken, userInfo, role }
        } catch (error) {
            throw error
        }
    },
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}

export default authService;