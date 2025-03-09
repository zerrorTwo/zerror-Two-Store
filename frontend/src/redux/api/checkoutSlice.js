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
      keepUnusedDataFor: 1,
    }),

    getUserTotalOrder: builder.query({
      query: ({ userId, time }) => ({
        url: `${CHECKOUT_URL}/get-total/?userId=${userId}&time=${time}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: `${CHECKOUT_URL}`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
  }),
});

export const {
  useGetProductCheckoutQuery,
  useCreateOrderMutation,
  useLazyGetUserTotalOrderQuery,
} = checkoutSlice;
