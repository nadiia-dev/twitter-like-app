import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/slice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch;
