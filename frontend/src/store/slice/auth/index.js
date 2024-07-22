import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isLogin: false,
    accessToken: null,
    userInfo: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLogin = true
            state.accessToken = action.payload.accessToken
            state.userInfo = action.payload.userInfo
        },
        logout: (state, action) => {
            state.isLogin = false
            state.accessToken = null
            state.userInfo = null
            localStorage.removeItem('refreshToken')
        }
    }
})

export const { login, logout } = authSlice.actions
export const authReducer = authSlice.reducer