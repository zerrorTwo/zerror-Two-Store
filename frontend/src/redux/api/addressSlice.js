import { apiSlice } from "./apiSlice";
import { ADDRESS_URL } from "../constants";

export const addressSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCity: builder.query({
      query: () => ({
        url: `${ADDRESS_URL}/city`,
        method: "GET",
      }),
      providesTags: ["Address"],
      keepUnusedDataFor: 5,
    }),
    getDistrict: builder.query({
      query: (id) => ({
        url: `${ADDRESS_URL}/district?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Address"],
      keepUnusedDataFor: 5,
    }),

    getWard: builder.query({
      query: (id) => ({
        url: `${ADDRESS_URL}/ward?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Address"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLazyGetCityQuery,
  useLazyGetDistrictQuery,
  useLazyGetWardQuery,
} = addressSlice;
