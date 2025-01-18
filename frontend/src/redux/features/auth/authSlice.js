import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo)?.user : null;
  })(),
  token: (() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? JSON.parse(storedToken).token : null;
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.token = accessToken;
    },
    // eslint-disable-next-line no-unused-vars
    logOut: (state, action) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectCurrentToken = (state) => state.auth.token;
