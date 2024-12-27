import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getAllCurrentUser: builder.query({
      query: () => ({
        url: `${USER_URL}/`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${USER_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetAllCurrentUserQuery,
  useUpdateUserMutation,
} = userApiSlice;
