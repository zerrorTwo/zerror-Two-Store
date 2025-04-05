import { apiSlice } from "./apiSlice";
import { MAIL_URL } from "../constants";

export const mailSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendVerificationEmail: builder.query({
      query: ({ email }) => ({
        url: `${MAIL_URL}/send-verification-email?email=${encodeURIComponent(
          email
        )}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    verifyEmail: builder.query({
      query: ({ email, code }) => ({
        url: `${MAIL_URL}/verify-email?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useLazySendVerificationEmailQuery, useLazyVerifyEmailQuery } =
  mailSlice;
