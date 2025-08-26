import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../AxiosInstance';

export const refreshUser = createAsyncThunk('user/refreshUser', async () => {
  const res = await axiosInstance.get('/users/getCurrentuser');
  return res.data;
});

const initialState = {
  user: null,
  isLoading: false,
  hasInitialized: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasInitialized = true;
        state.user = action.payload?.user || action.payload || null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasInitialized = true;
        state.error = action.error?.message || 'Failed to load user';
        state.user = null;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;


