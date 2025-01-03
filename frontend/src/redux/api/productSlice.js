import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

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
    createNewProduct: builder.mutation({
      query: ({ data }) => ({
        url: `${PRODUCT_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

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

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useUploadProductImageMutation,
  useCreateNewProductMutation,
} = productApiSlice;
