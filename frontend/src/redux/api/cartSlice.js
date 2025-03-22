import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCart: builder.query({
      query: () => ({
        url: `${CART_URL}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 1,
    }),

    getMiniCart: builder.query({
      query: () => ({
        url: `${CART_URL}/recent`,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 1,
    }),

    addToCart: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateVariation: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/update-variation`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCheckout: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/update-checkout`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateAllCheckout: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/update-all-checkout`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeProduct: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetAllCartQuery,
  useGetMiniCartQuery,
  useRemoveProductMutation,
  useUpdateVariationMutation,
  useUpdateCheckoutMutation,
  useUpdateAllCheckoutMutation,
} = cartApiSlice;
