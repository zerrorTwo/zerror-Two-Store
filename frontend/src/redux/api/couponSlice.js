import { apiSlice } from "./apiSlice";
import { COUPON_URL } from "../constants";

export const couponSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: ({ page, limit, search = "" }) => ({
        url: `${COUPON_URL}/?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
      keepUnusedDataFor: 20,
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

 
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateNewCouponMutation
} = couponSlice;
