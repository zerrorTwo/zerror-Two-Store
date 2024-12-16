import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
      }),
      keepUnusedDataFor: 1,
    }),
    getAllCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/`,
      }),
      keepUnusedDataFor: 1,
    }),
  }),
});

export const { useGetCurrentUserQuery, useGetAllCurrentUserQuery } =
  userApiSlice;
