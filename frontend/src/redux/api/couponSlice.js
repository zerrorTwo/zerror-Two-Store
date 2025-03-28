import { apiSlice } from "./apiSlice";
import { COUPON_URL } from "../constants";

export const couponSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: ({ page, limit, search = "" }) => ({
        url: `${COUPON_URL}/?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
      keepUnusedDataFor: 20,
    }),

    getAvailableCoupons: builder.query({
      query: () => ({
        url: `${COUPON_URL}/available`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
      keepUnusedDataFor: 5,
    }),

    getProductCoupon: builder.query({
      query: (productId) => ({
        url: `${COUPON_URL}/${productId}`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
      keepUnusedDataFor: 5,
    }),

    createNewCoupon: builder.mutation({
      query: ({ data }) => ({
        url: `${COUPON_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
      keepUnusedDataFor: 5,
    }),

    applyCoupon: builder.mutation({
      query: (couponCode) => ({
        url: `${COUPON_URL}/apply`,
        method: "POST",
        body: { code: couponCode },
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateNewCouponMutation,
  useGetAvailableCouponsQuery,
  useApplyCouponMutation,
  useGetProductCouponQuery,
} = couponSlice;
