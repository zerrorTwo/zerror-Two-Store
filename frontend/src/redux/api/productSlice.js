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

    getProductBySlug: builder.query({
      query: (slug) => ({
        url: `${PRODUCT_URL}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getProductById: builder.query({
      query: (_id) => ({
        url: `${PRODUCT_URL}/select/${_id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getTopSold: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getPageProduct: builder.query({
      query: ({
        page = 1,
        limit = 10,
        category = "",
        search = "",
        sort = "",
      }) => ({
        url: `${PRODUCT_URL}?page=${page}&limit=${limit}&category=${category}&search=${search}&sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    searchProduct: builder.query({
      query: ({
        page = 1,
        limit = 10,
        category = "",
        search = "",
        sort = "",
      }) => ({
        url: `${PRODUCT_URL}/search?page=${page}&limit=${limit}&category=${category}&search=${search}&sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 20,
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
      query: ({ _id, ...body }) => ({
        url: `${PRODUCT_URL}/${_id}`,
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

    getProductWithBreadcrumbById: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/breadcrumb/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 10,
    }),

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
  useGetProductBySlugQuery,
  useLazyGetProductByIdQuery,
  useGetTopSoldQuery,
  useSearchProductQuery,
  useGetProductWithBreadcrumbByIdQuery,
} = productApiSlice;
