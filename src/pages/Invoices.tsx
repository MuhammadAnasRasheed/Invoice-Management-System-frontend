import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getInvoices, updateInvoiceStatus, deleteInvoice } from '../features/invoices/invoiceSlice';
import { format } from 'date-fns';
import type { InvoiceStatus } from '../types';
import toast from 'react-hot-toast';
import { EyeIcon, TrashIcon,MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Invoices = () => {
  const dispatch = useAppDispatch();
  const { invoices, isLoading } = useAppSelector((state) => state.invoices);
  const [searchTerm,setSearchTerm]=useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Searching for:', searchTerm);
      if (!searchTerm) {
        dispatch(getInvoices(searchTerm||''));
      } else {
        dispatch(getInvoices(searchTerm));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dispatch, searchTerm]);

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    await dispatch(updateInvoiceStatus({ id, status }));
    toast.success('Status updated successfully');
    dispatch(getInvoices(searchTerm||''));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await dispatch(deleteInvoice(id));
      toast.success('Invoice deleted successfully');
      dispatch(getInvoices(searchTerm||''));
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const invoiceStatuses: InvoiceStatus[] = [
  'draft',
  'pending',
  'paid',
  'overdue',
  'cancelled',
];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <Link
          to="/invoices/create"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Invoice
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search invoice by number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 mt-5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>


      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">Loading...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">No invoices found</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link to={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.customer?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PKR {(Number(invoice.total)).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={invoice.status}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value as InvoiceStatus)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(invoice.status)}`}
                      >
                        {Object.values(invoiceStatuses).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <EyeIcon className="h-5 w-5 inline" />
                      </Link>
                      <button onClick={() => handleDelete(invoice.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};