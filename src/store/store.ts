import { configureStore } from "@reduxjs/toolkit";
import days from "./slices/days";

const store = configureStore({
  reducer: {
    data: days,
  },
});

// Correctly define RootState based on the Redux store
export type RootState = ReturnType<typeof store.getState>;

export default store;
