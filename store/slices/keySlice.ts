// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of the action payload for setting user
type KeyPayload = {
  lastEvaluatedKey: string | null;
};

// Define the slice
const keySlice = createSlice({
  name: "user",
  initialState: {
    lastEvaluatedKey: null,
  } as KeyPayload,
  reducers: {
    setKey(state, action: PayloadAction<KeyPayload>) {
      state.lastEvaluatedKey = action.payload.lastEvaluatedKey;
    },
  },
});

// Export actions and reducer
export const { setKey } = keySlice.actions;
export default keySlice.reducer;
