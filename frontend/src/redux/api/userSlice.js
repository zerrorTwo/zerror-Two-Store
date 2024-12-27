import { apiSlice } from "./apiSlice";
import { USER_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteAll: builder.mutation({
      query: (_id) => ({
        url: `${USER_URL}/delete-many`,
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["User"],
    }),
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
  useDeleteAllMutation,
} = userApiSlice;
