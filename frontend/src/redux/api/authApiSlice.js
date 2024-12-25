import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        //"http://localhost:5000/v1/api/auth/signIn"
        url: `${BASE_URL}/auth/signIn`,
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        //"http://localhost:5000/v1/api/auth/signUp"
        url: `${BASE_URL}/auth/signUp`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        //"http://localhost:5000/v1/api/auth/lougot"
        url: `${BASE_URL}/auth/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLoginGGMutation,
} = authApiSlice;
