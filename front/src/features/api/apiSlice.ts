import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: (builder) => ({
    compress: builder.mutation<
      {
        filename: string;
        newSize: number;
      },
      { file: File; sessionId: number }
    >({
      query: (dto: { file: File; sessionId: number }) => {
        const { file, sessionId } = dto;
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `squoosh/uploadAndCompress/${sessionId}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    getZipBlob: builder.mutation<Blob, any>({
      query: (sessionId: number) => ({
        url: `squoosh/getZip/${sessionId}`,
        method: "GET",
        responseType: "blob",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useCompressMutation, useGetZipBlobMutation } = apiSlice;
