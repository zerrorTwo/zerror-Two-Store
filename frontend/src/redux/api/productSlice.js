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

    getPageProduct: builder.query({
      query: ({ page = 1, limit = 10, category = "", search = null }) => ({
        url: `${PRODUCT_URL}?page=${page}&limit=${limit}&category=${category}&search=${search}`,
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

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

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

    deleteAllProduct: builder.mutation({
      query: (_id) => ({
        url: `${PRODUCT_URL}/delete`,
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useGetPageProductQuery,
  useUploadProductImageMutation,
  useUpdateProductMutation,
  useDeleteAllProductMutation,
  useCreateNewProductMutation,
} = productApiSlice;
