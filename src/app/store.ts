import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customers/customerSlice';
import invoiceReducer from '../features/invoices/invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    invoices: invoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;