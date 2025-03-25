
import { apiSlice } from "./apiSlice";
import { COUPON_URL } from "../constants";

export const couponSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => ({
        url: `${COUPON_URL}/`,
        method: "GET",
      }),
      providesTags: ["Coupon"],
      keepUnusedDataFor: 20,
    }),
   

    // createUserAddress: builder.mutation({
    //   query: ({ data }) => ({
    //     url: `${ADDRESS_URL}`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Address"],
    // }),

 
  }),
});

export const {
  useGetAllCouponsQuery,
} = couponSlice;
