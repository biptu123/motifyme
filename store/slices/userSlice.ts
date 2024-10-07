// store/slices/userSlice.ts
import { UserState } from "@/models/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of the action payload for setting user
type SetUserPayload = {
  username: string;
  phone: string | null;
  accessToken: string;
};

// Define the slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    phone: null,
    accessToken: null,
  } as UserState,
  reducers: {
    setUser(state, action: PayloadAction<SetUserPayload>) {
      state.username = action.payload.username;
      state.phone = action.payload.phone;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.username = "";
      state.phone = null;
      state.accessToken = null;
    },
  },
});

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
