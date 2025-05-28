// src/features/api/uploadApiSlice.js
import { apiSlice } from "./apiSlice";
import { UPLOAD_URL } from "../constants";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProductImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file); // Match backend's expected field name
        formData.append("folderType", "product"); // Specify Product folder

        return {
          url: `${UPLOAD_URL}/ggdrive`, // Backend route for Google Drive upload
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

// Export the auto-generated hook for the mutation
export const { useUploadProductImageMutation } = uploadApiSlice;