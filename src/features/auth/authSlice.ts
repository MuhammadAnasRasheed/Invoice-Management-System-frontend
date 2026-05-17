import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI} from './authApi';
import type {LoginData, RegisterData } from './authApi';
import type { AuthState} from '../../types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isError: false,
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message || 
                      err?.errors?.[0]?.message || 
                      err?.error || 
                      'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message || 
                      err?.errors?.[0]?.message || 
                      err?.error || 
                      'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authAPI.getMe();
      return user;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message || 
                      err?.errors?.[0]?.message || 
                      err?.error || 
                      'Failed to get users';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = '';
      state.isError = false;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearMessage,clearAuth } = authSlice.actions;
export default authSlice.reducer;