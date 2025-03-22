import { apiSlice } from "./apiSlice";
import { CHECKOUT_URL, PAYMENT_URL } from "../constants";

export const checkoutSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductCheckout: builder.query({
      query: () => ({
        url: `${CHECKOUT_URL}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 1,
    }),

    getUserTotalOrder: builder.query({
      query: ({ time }) => ({
        url: `${CHECKOUT_URL}/get-total/?time=${time}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, search }) => ({
        url: `${CHECKOUT_URL}/all?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${CHECKOUT_URL}/detail/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      keepUnusedDataFor: 5,
    }),

    getUserOrder: builder.query({
      query: ({ page, limit, filter }) => ({
        url: `${CHECKOUT_URL}/get-all/?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.filter}`;
      },
      merge: (currentCache, newItems) => {
        if (currentCache.page === 1) {
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

    updateOrderState: builder.mutation({
      query: (data) => ({
        url: `${CHECKOUT_URL}/update-state`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    updateOrderDeliveryState: builder.mutation({
      query: (data) => ({
        url: `${CHECKOUT_URL}/update-delivery-state`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    createMomoPayment: builder.mutation({
      query: (orderId) => ({
        url: `${PAYMENT_URL}/momo/create`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: orderId,
      }),
      invalidatesTags: ["Order"],
    }),

    verifyPaymentUrlExpiration: builder.mutation({
      query: (orderId) => ({
        url: `${PAYMENT_URL}/momo/transaction-status`,
        method: "POST",
        body: { orderId },
      }),
    }),
  }),
});

export const {
  useGetProductCheckoutQuery,
  useCreateOrderMutation,
  useLazyGetUserTotalOrderQuery,
  useGetUserOrderQuery,
  useGetAllOrdersQuery,
  useCreateMomoPaymentMutation,
  useVerifyPaymentUrlExpirationMutation,
  useGetOrderByIdQuery,
  useUpdateOrderStateMutation,
  useUpdateOrderDeliveryStateMutation,
} = checkoutSlice;
