import { _retrieveToken, _retrieveUsername } from "@/lib/async-storage";
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Base query that adds the token to every request
const baseQueryWithToken: BaseQueryFn = async (args, api, extraOptions) => {
  const token = await _retrieveToken();
  const username = await _retrieveUsername();

  // Proceed with the modified query
  return fetchBaseQuery({
    baseUrl: `${BASE_URL}/${username}`, // Your base URL
    prepareHeaders: (headers) => {
      headers.set("authorizationToken", token ?? "");
      return headers;
    },
  })(args, api, extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithToken,
  tagTypes: ["Meta", "Note"],
  endpoints: (builder) => ({}),
});
