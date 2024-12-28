import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).user
    : null,
  userId: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).user._id
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).token
    : null,
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
    },
    // eslint-disable-next-line no-unused-vars
    logOut: (state, action) => {
      state.userInfo = null;
      state.userId = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUserId = (state) => state.auth.userId;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectCurrentToken = (state) => state.auth.token;
