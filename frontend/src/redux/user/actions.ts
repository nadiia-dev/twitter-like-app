import {
  deleteUserAPI,
  loginUserAPI,
  loginWithGoogleAPI,
  logoutAPI,
  registerUserAPI,
} from "@/api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "user/register",
  async (Data: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await registerUserAPI(Data);
      if (!res) {
        throw new Error("User creation failed");
      }
      return res;
    } catch (e) {
      if (e instanceof Error) return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await loginUserAPI(data);
      if (!res) {
        throw new Error("User creation failed");
      }
      return res;
    } catch (e) {
      if (e instanceof Error) return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/googleLogin",
  async (_, thunkAPI) => {
    try {
      const res = await loginWithGoogleAPI();
      if (!res) {
        throw new Error("User creation failed");
      }
      return res;
    } catch (e) {
      if (e instanceof Error) return thunkAPI.rejectWithValue(e.message);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    return await logoutAPI();
  } catch (e) {
    if (e instanceof Error) return thunkAPI.rejectWithValue(e.message);
  }
});

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (_, thunkAPI) => {
    try {
      return await deleteUserAPI();
    } catch (e) {
      if (e instanceof Error) return thunkAPI.rejectWithValue(e.message);
    }
  }
);
