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
  if (result.error && result.error.status === 401) {
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
      console.log(token);

      // store the new token
      api.dispatch(setCredentials({ user: userInfo, accessToken: token }));
      // retry request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("hihi");
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
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
