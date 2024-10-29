// store/store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { apiSlice } from "./apis/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import keyReducer from "./slices/keySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    key: keyReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
setupListeners(store.dispatch);
