import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/all`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    // createNew: builder.mutation({
    //   query: (body) => ({
    //     url: `${PRODUCT_URL}/category/`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Category"],
    // }),

    // updateCategory: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: `${PRODUCT_URL}/category/${id}`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Category"],
    // }),

    // deleteCategory: builder.mutation({
    //   query: (_id) => ({
    //     url: `${PRODUCT_URL}/category/${_id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Category"],
    // }),

    // searchCategory: builder.query({
    //   query: (searchTerm) => ({
    //     url: `${PRODUCT_URL}/category/search`,
    //     params: { keyword: searchTerm },
    //   }),
    //   keepUnusedDataFor: 60,
    // }),
  }),
});

export const { useGetAllProductQuery } = productApiSlice;
