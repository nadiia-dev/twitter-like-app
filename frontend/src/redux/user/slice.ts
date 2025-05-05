import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import {
  deleteUser,
  loginUser,
  loginWithGoogle,
  logout,
  registerUser,
} from "./actions";

interface UserState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const userReducer = userSlice.reducer;
