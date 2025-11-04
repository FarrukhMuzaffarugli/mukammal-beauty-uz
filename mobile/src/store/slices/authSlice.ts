import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth';
import { AuthResponse, AuthTokens, User } from '@/types';
import { tokenManager } from '@/lib/tokenManager';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: undefined,
  initialized: false
};

const persistTokens = async (tokens: AuthTokens | null) => {
  await tokenManager.setTokens(tokens);
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    await tokenManager.hydrate();
    const tokens = tokenManager.getTokens();
    if (!tokens) {
      return { user: null, tokens: null };
    }
    const user = await authApi.profile();
    return { user, tokens };
  } catch (error) {
    await persistTokens(null);
    return rejectWithValue('Failed to bootstrap');
  }
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      await persistTokens(response.tokens);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string; phone?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.register(payload);
      await persistTokens(response.tokens);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  const tokens = state.auth.tokens;
  try {
    await authApi.logout(tokens?.refreshToken);
  } finally {
    await persistTokens(null);
  }
});

export const refreshProfile = createAsyncThunk('auth/refreshProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.profile();
    return user;
  } catch (error) {
    return rejectWithValue('Failed to load profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.initialized = true;
      })
      .addCase(bootstrapAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.initialized = true;
        state.user = null;
        state.tokens = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.status = 'idle';
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
