import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState:{
        isLogin: false,
        accessToken: null,
        userInfo: null,
        role: null
    },
    reducers: {
        login: (state, action) => {

            state.isLogin = true;
            state.accessToken = action.payload.accessToken;
            state.userInfo = action.payload.userInfo;
            state.role = action.payload.role;

        },
        logout: (state) => {

            state.isLogin = false;
            state.accessToken = null;
            state.userInfo = null;
            state.role = null;
            localStorage.removeItem('refreshToken');

        },
        updateUser: (state, action) => {

            state.userInfo = { ...state.userInfo, ...action.payload };

        }
    }
});
export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;