import { apiSlice } from "./apiSlice";
import { REVIEW_URL } from "../constants";

export const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: ({ data }) => ({
        url: `${REVIEW_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
      keepUnusedDataFor: 5,
    }),
    getAllProductReviews: builder.query({
      query: ({ id, page, limit }) => ({
        url: `${REVIEW_URL}?productId=${id}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Review"],
      keepUnusedDataFor: 60,
    }),
    deleteReview: builder.mutation({
      query: ({ data }) => ({
        url: `${REVIEW_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetAllProductReviewsQuery,
  useDeleteReviewMutation,
} = reviewSlice;
