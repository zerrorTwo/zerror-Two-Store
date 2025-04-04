import { apiSlice } from "./apiSlice";
import { MAIL_URL } from "../constants";

export const mailSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendVerificationEmail: builder.mutation({
      query: ({ gmail }) => ({
        url: `${MAIL_URL}/send-verification-email`,
        method: "POST",
        body: gmail,
      }),
      keepUnusedDataFor: 5,
    }),

    verifyGmail: builder.query({
      query: ({ gmail, code }) => ({
        url: `${MAIL_URL}/verify-gmail?email=${encodeURIComponent(
          gmail
        )}&code=${encodeURIComponent(code)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useSendVerificationEmailMutation, useLazyVerifyGmailQuery } =
  mailSlice;
