import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  problems: [],
};

const problemsSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setProblems: (state, action) => {
      state.problems = action.payload;
    },
  },
});

export const { setProblems } = problemsSlice.actions;
export default problemsSlice.reducer;
