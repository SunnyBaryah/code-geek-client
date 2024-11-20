import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.ts";
import problemsSlice from "./problemsSlice.ts";
import submissionSlice from "./submissionsSlice.ts";
const store = configureStore({
  reducer: {
    auth: authSlice,
    problems: problemsSlice,
    submissions: submissionSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
