import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shopAPI } from './shopApi';
import type { ShopState, Shop } from '../../types';

const initialState: ShopState = {
  shops: [],
  selectedShopId: 'all',
  isLoading: false,
  isError: false,
  message: '',
  currentShop: null,
};

export const getShops = createAsyncThunk(
  'shops/getAll',
  async (searchTerm: string = '', { rejectWithValue }) => {
    try {
      return await shopAPI.getAll(searchTerm);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch shops';
      return rejectWithValue(message);
    }
  }
);

export const getShopById = createAsyncThunk(
  'shops/getById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      return await shopAPI.getById(id);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch shop';
      return rejectWithValue(message);
    }
  }
);

export const createShop = createAsyncThunk(
  'shops/create',
  async (data: Partial<Shop>, { rejectWithValue }) => {
    try {
      return await shopAPI.create(data);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to register shop';
      return rejectWithValue(message);
    }
  }
);

export const updateShop = createAsyncThunk(
  'shops/update',
  async ({ id, data }: { id: string | number; data: Partial<Shop> }, { rejectWithValue }) => {
    try {
      return await shopAPI.update(id, data);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to update shop';
      return rejectWithValue(message);
    }
  }
);

export const deleteShop = createAsyncThunk(
  'shops/delete',
  async (id: string | number, { rejectWithValue }) => {
    try {
      await shopAPI.delete(id);
      return id;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to delete shop';
      return rejectWithValue(message);
    }
  }
);

const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    setCurrentShop: (state, action) => {
      state.currentShop = action.payload;
    },
    setSelectedShopId: (state, action) => {
      state.selectedShopId = action.payload;
    },
    clearShopError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getShops.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload;
        if (action.payload && action.payload.length > 0 && !state.currentShop) {
          state.currentShop = action.payload[0];
        }
      })
      .addCase(getShops.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get by ID
      .addCase(getShopById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShop = action.payload;
      })
      // Create
      .addCase(createShop.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops.push(action.payload);
        state.currentShop = action.payload;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update
      .addCase(updateShop.fulfilled, (state, action) => {
        const index = state.shops.findIndex(s => String(s.id) === String(action.payload.id));
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
        if (state.currentShop && String(state.currentShop.id) === String(action.payload.id)) {
          state.currentShop = action.payload;
        }
      })
      // Delete
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.shops = state.shops.filter(s => String(s.id) !== String(action.payload));
        if (state.currentShop && String(state.currentShop.id) === String(action.payload)) {
          state.currentShop = state.shops[0] || null;
        }
      });
  },
});

export const { setCurrentShop, setSelectedShopId, clearShopError } = shopSlice.actions;
export default shopSlice.reducer;
