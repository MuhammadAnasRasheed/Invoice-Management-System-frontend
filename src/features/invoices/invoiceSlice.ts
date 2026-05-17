import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceAPI } from './invoiceApi';
import type { CreateInvoiceData } from './invoiceApi';
import type { InvoiceState } from '../../types';

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  isError: false,
  message: '',
  customerInvoices:[],
};

export const getInvoices = createAsyncThunk(
  'invoices/getAll',
  async (searchTerm: string = '', { rejectWithValue }) => {
    try {
      return await invoiceAPI.getAll(searchTerm);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch invoices';
      return rejectWithValue(message);
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  'invoices/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await invoiceAPI.getById(id);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to fetch invoice';
      return rejectWithValue(message);
    }
  }
);

export const getInvoicesByCustomer = createAsyncThunk(
  'invoices/getByCustomer',
  async (customerId: string, { rejectWithValue }) => {
    try {
      return await invoiceAPI.getByCustomerId(customerId);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message || 'Failed to fetch customer invoices';
      return rejectWithValue(message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (data: CreateInvoiceData, { rejectWithValue }) => {
    try {
      return await invoiceAPI.create(data);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to create invoice';
      return rejectWithValue(message);
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await invoiceAPI.updateStatus(id, status);
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to update status';
      return rejectWithValue(message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await invoiceAPI.delete(id);
      return id;
    } catch (error: any) {
      const err = error.response?.data;
      const message = err?.message ||
        err?.errors?.[0]?.message ||
        err?.error ||
        'Failed to delete invoice';
      return rejectWithValue(message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      //Get By customer
      .addCase(getInvoicesByCustomer.fulfilled, (state, action) => {
        state.isLoading=false;
        state.customerInvoices = action.payload;  // Add to state
      })
      //Get By Id
      .addCase(getInvoiceById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
      })
      // Update Status
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      // Delete
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i.id !== action.payload);
      });
  },
});

export const { clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;