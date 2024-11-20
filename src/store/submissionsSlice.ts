import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  submissions: [],
};

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    setSubmissions: (state, action) => {
      state.submissions = action.payload;
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
});

export const { setSubmissions, clearSubmissions } = submissionsSlice.actions;
export default submissionsSlice.reducer;
