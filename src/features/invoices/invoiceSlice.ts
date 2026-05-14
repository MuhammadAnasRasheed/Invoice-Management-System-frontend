import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceAPI } from './invoiceApi';
import type { CreateInvoiceData } from './invoiceApi';
import type { InvoiceState, Invoice } from '../../types';

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const getInvoices = createAsyncThunk(
  'invoices/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await invoiceAPI.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const getInvoiceById = createAsyncThunk(
  'invoices/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await invoiceAPI.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (data: CreateInvoiceData, { rejectWithValue }) => {
    try {
      return await invoiceAPI.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await invoiceAPI.updateStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice');
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
      // Get By Id
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