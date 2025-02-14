import { apiSlice } from "./apiSlice";
import { CART_URL } from "../constants";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCart: builder.query({
      query: (userId) => ({
        url: `${CART_URL}?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 5,
    }),

    getMiniCart: builder.query({
      query: (userId) => ({
        url: `${CART_URL}/recent?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 5,
    }),

    addToCart: builder.mutation({
      query: (body) => ({
        url: `${CART_URL}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useAddToCartMutation, useGetAllCartQuery, useGetMiniCartQuery } =
  cartApiSlice;
