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
        logout: (state) => {
            state.isLogin = false
            state.accessToken = null
            state.userInfo = null
            localStorage.removeItem('refreshToken')
        },
        updateUser: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload }
        }
    }
})

export const { login, logout, updateUser } = authSlice.actions
export const authReducer = authSlice.reducer