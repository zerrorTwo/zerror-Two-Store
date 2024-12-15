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
      const expires = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days from now

      // Store user info with expiration timestamp
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user,
          expires,
        })
      );
    },
    // eslint-disable-next-line no-unused-vars
    logOut: (state, action) => {
      state.userInfo = null;
      state.userId = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUserId = (state) => state.auth.userId;
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectCurrentToken = (state) => state.auth.token;
