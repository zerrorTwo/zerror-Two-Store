import { apiSlice } from "./apiSlice";
import { CHECKOUT_URL } from "../constants";

export const checkoutSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductCheckout: builder.query({
      query: (userId) => ({
        url: `${CHECKOUT_URL}?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: `${CHECKOUT_URL}`,
        method: "POST",
        body: JSON.stringify(data), // Chuyển thành JSON
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetProductCheckoutQuery, useCreateOrderMutation } =
  checkoutSlice;
