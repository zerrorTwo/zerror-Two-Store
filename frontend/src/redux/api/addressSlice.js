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

    createUserAddress: builder.mutation({
      query: ({ data }) => ({
        url: `${ADDRESS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    getAllUserAddress: builder.query({
      query: () => ({
        url: `${ADDRESS_URL}`,
        method: "GET",
      }),
      providesTags: ["Address"],
      keepUnusedDataFor: 5,
    }),

    getUserAddressById: builder.query({
      query: (id) => ({
        url: `${ADDRESS_URL}/user?id=${id}`,
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
  useCreateUserAddressMutation,
  useGetAllUserAddressQuery,
  useLazyGetUserAddressByIdQuery,
} = addressSlice;
