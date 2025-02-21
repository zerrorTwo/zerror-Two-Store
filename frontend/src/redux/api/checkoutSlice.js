import { apiSlice } from "./apiSlice";
import { CHECKOUT_URL } from "../constants";

export const checkoutSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductCheckout: builder.query({
      query: (userId) => ({
        url: `${CHECKOUT_URL}?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
      keepUnusedDataFor: 5,
    }),

    addToCart: builder.mutation({
      query: (body) => ({
        url: `${CHECKOUT_URL}/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useGetProductCheckoutQuery } = checkoutSlice;
