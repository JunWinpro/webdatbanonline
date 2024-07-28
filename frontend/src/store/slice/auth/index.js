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
            console.log("Auth slice: Processing login", action.payload);
            state.isLogin = true;
            state.accessToken = action.payload.accessToken;
            state.userInfo = action.payload.userInfo;
            state.role = action.payload.role;
            console.log("Auth slice: New state after login", state);
        },
        logout: (state) => {
            console.log("Auth slice: Processing logout");
            state.isLogin = false;
            state.accessToken = null;
            state.userInfo = null;
            state.role = null;
            localStorage.removeItem('refreshToken');
            console.log("Auth slice: New state after logout", state);
        },
        updateUser: (state, action) => {
            console.log("Auth slice: Updating user", action.payload);
            state.userInfo = { ...state.userInfo, ...action.payload };
            console.log("Auth slice: New state after user update", state);
        }
    }
});
export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;