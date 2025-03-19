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

      // Set localStorage
      const expires = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user,
          expires,
        })
      );
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: accessToken,
          expires,
        })
      );
    },
    setUser: (state, action) => {
      state.userInfo = action.payload;
      // Cập nhật localStorage
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        parsedUserInfo.user = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(parsedUserInfo));
      }
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

export const { setCredentials, setUser, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectCurrentToken = (state) => state.auth.token;
