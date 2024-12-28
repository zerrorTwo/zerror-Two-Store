import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNew: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/category/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `${BASE_URL}/category`,
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BASE_URL}/category/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (_id) => ({
        url: `${BASE_URL}/category/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    searchCategory: builder.query({
      query: (searchTerm) => ({
        url: `${BASE_URL}/category/search`,
        params: { keyword: searchTerm },
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useCreateNewMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSearchCategoryQuery,
} = categoryApiSlice;
