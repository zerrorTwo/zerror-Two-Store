import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logOut, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    const userId = getState().auth.userInfo?._id;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (userId) {
      headers.set("x-client-id", userId);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const { token, userInfo } = api.getState().auth;

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const isLoggedIn = token && userInfo;

  // Skip refresh logic for login, register, and logout requests
  const isLoginOrRegister =
    args.url.includes("/auth/signIn") || args.url.includes("/auth/signUp");
  const isLogout = args.url.includes("/auth/logout");

  if (
    isLoggedIn &&
    !isLoginOrRegister &&
    !isLogout &&
    result.error &&
    result.error.status === 401
  ) {
    // Try refreshing the token only if logged in
    const refreshResult = await baseQuery(
      {
        url: `${BASE_URL}/auth/refresh`,
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newToken = refreshResult.data;
      api.dispatch(setCredentials({ user: userInfo, accessToken: newToken }));

      // Retry the original request after refreshing the token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, logout the user only if logged in
      await baseQuery(
        {
          url: `${BASE_URL}/auth/logout`,
          method: "POST",
        },
        api,
        extraOptions
      );

      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product", "Order", "User", "Category", "Cart", "Address"],
  endpoints: () => ({}),
});
