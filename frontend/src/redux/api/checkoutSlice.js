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

    getUserOrder: builder.query({
      query: ({ userId, page, limit, filter }) => {
        return {
          url: `${CHECKOUT_URL}/get-all/?userId=${userId}&page=${page}&limit=${limit}&filter=${filter}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.userId}-${queryArgs.filter}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          orders: [...currentCache.orders, ...newItems.orders],
          hasMore: newItems.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.filter !== previousArg?.filter
        );
      },
      providesTags: ["Order"],
      keepUnusedDataFor: 0,
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
  useGetUserOrderQuery,
} = checkoutSlice;
