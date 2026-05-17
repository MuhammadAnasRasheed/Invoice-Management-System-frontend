import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerAPI } from './customerApi';
import type { CustomerState, Customer } from '../../types';

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  isError: false,
  message: '',
  currentCustomer: null,
};

export const getCustomers = createAsyncThunk(
  'customers/getAll',
  async (searchTerm: string = '', { rejectWithValue }) => {
    try {
      return await customerAPI.getAll(searchTerm);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch customers';
      return rejectWithValue(message);
    }
  }
);

export const getCustomerById = createAsyncThunk(
  'customers/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await customerAPI.getById(id);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch customer';
      return rejectWithValue(message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data: Partial<Customer>, { rejectWithValue }) => {
    try {
      return await customerAPI.create(data);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to create customer';
      return rejectWithValue(message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      return await customerAPI.update(id, data);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to update customer';
      return rejectWithValue(message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await customerAPI.delete(id);
      return id;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to delete customer';
      return rejectWithValue(message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;  // ✅ Must set currentCustomer
      })
      // Create
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      // Update
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
      });
  },
});

export default customerSlice.reducer;