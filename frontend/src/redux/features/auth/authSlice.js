import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.userId = user._id;
      state.token = accessToken;
      const expires = new Date().getTime() * 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("userInfo", JSON.stringify(user), {
        expires: expires,
      });
    },
    // eslint-disable-next-line no-unused-vars
    logout: (state, action) => {
      state.userInfo = null;
      state.userId = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
