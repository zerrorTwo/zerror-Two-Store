import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth/signIn`,
        method: "POST",
        body: data,
      }),
    }),

    googleCallback: builder.query({
      query: (code) => ({
        url: `${BASE_URL}/auth/google/callback?code=${code}`,
        method: "GET",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth/signUp`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/auth/logout`,
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${BASE_URL}/auth/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email, code, newPassword }) => ({
        url: `${BASE_URL}/auth/reset-password`,
        method: "POST",
        body: { email, code, newPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleCallbackQuery,
} = authApiSlice;
