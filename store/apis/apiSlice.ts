import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `https://y8u5gse73l.execute-api.ap-south-1.amazonaws.com/dev/notes`,
  }),
  tagTypes: ["Meta", "Note"],
  endpoints: (builder) => ({}),
});
