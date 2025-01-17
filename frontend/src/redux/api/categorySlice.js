import { apiSlice } from "./apiSlice";
import { BASE_URL, UPLOAD_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: `${BASE_URL}/category/all`,
        method: "GET",
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    getChildrenCategory: builder.query({
      query: (_id) => ({
        url: `${BASE_URL}/category/${_id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    getAllCategoriesParent: builder.query({
      query: () => ({
        url: `${BASE_URL}/category`,
        method: "GET",
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    getAllCategories: builder.query({
      query: ({ parent, page, limit }) => ({
        url: `${BASE_URL}/category/?parent=${parent}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    createNewCategory: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/category/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `${BASE_URL}/category/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/category`,
        body,
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

    uploadCategoryImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/category`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetAllCategoriesParentQuery,
  useGetChildrenCategoryQuery,
  useGetAllCategoriesQuery,
  useCreateNewCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useSearchCategoryQuery,
} = categoryApiSlice;
