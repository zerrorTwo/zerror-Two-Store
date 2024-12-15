import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        //"http://localhost:5000/v1/api/auth/signIn"
        url: `${BASE_URL}/auth/signIn`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApiSlice;
