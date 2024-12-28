import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants";
import { logOut, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    // console.log(userId, token);

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

  // Skip the refresh logic for login, register, and logout requests
  const isLoginOrRegister =
    args.url.includes("/auth/signIn") || args.url.includes("/auth/signUp");
  const isLogout = args.url.includes("/auth/logout");

  if (
    !isLoginOrRegister &&
    !isLogout &&
    result.error &&
    result.error.status === 401
  ) {
    // Try refreshing the token
    const refreshResult = await baseQuery(
      {
        url: `${BASE_URL}/auth/refresh`,
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const userInfo = api.getState().auth.userInfo;
      const token = refreshResult.data;
      api.dispatch(setCredentials({ user: userInfo, accessToken: token }));

      // Retry the original request after refreshing the token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, logout the user
      result = await baseQuery(
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
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
