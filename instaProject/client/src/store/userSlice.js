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
    updateFollowingBy(state, action) {
      if (!state.user) return;
      const delta = Number(action.payload) || 0;
      const curr = Number(state.user.following || 0);
      state.user.following = Math.max(0, curr + delta);
    },
    updateFollowersBy(state, action) {
      if (!state.user) return;
      const delta = Number(action.payload) || 0;
      const curr = Number(state.user.followers || 0);
      state.user.followers = Math.max(0, curr + delta);
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

export const { clearUser, updateFollowingBy, updateFollowersBy } = userSlice.actions;
export default userSlice.reducer;
