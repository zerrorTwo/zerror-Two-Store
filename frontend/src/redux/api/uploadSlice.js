// src/features/api/uploadApiSlice.js
import { apiSlice } from "./apiSlice";
import { UPLOAD_URL } from "../constants";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: ({ file, type }) => {
        const formData = new FormData();
        formData.append("file", file); // Match backend's expected field name
        formData.append("folderType", type); // Specify Product folder

        return {
          url: `${UPLOAD_URL}/cloudinary`, // Backend route for Google Drive upload
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

// Export the auto-generated hook for the mutation
export const { useUploadImageMutation } = uploadApiSlice;