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
      query: ({ page, limit, filter = "" }) => ({
        url: `${CHECKOUT_URL}/get-all/?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
      // Chỉ cần phân biệt theo filter
      serializeQueryArgs: ({ queryArgs }) => {
        return `filter=${queryArgs.filter || ""}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // Nếu là trang đầu tiên hoặc đổi filter, thay thế toàn bộ dữ liệu
        if (arg.page === 1) {
          return newItems;
        }
        
        // Trường hợp trang tiếp theo, gộp dữ liệu và đảm bảo không trùng lặp
        const combinedOrders = [...currentCache.orders];
        const existingIds = new Set(combinedOrders.map(order => order._id));
        
        newItems.orders.forEach(order => {
          if (!existingIds.has(order._id)) {
            combinedOrders.push(order);
            existingIds.add(order._id);
          }
        });
        
        return {
          orders: combinedOrders,
          hasMore: newItems.hasMore,
          page: arg.page
        };
      },
      // Xác định khi nào cần fetch lại dữ liệu
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.filter !== previousArg?.filter
        );
      },
      // Xử lý lỗi khi fetch
      onError: (error) => {
        console.error("Error fetching orders:", error);
      },
      providesTags: ["Order"],
      // Tăng thời gian cache để giảm số lần gọi API
      keepUnusedDataFor: 60, // 60 seconds
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
