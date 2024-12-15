import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants";
import { logOut, setCredentials } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
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
  if (result?.error?.originalStatus == 403) {
    console.log("sending refresh token");
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    if (refreshResult?.data) {
      const userInfo = api.getState().auth.userInfo;
      const userId = api.getState().auth.userId;
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, userInfo, userId }));
      // retry request
      result = await baseQuery(args, api, extraOptions);
    } else {
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
