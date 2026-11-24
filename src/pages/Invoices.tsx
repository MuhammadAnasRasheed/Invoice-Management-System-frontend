import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getInvoices, updateInvoiceStatus, deleteInvoice } from '../features/invoices/invoiceSlice';
import { getShops } from '../features/shops/shopSlice';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { statusAPI, type StatusItem } from '../features/statuses/statusApi';

export const Invoices = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { invoices, isLoading } = useAppSelector((state) => state.invoices);
  const { shops } = useAppSelector((state) => state.shops);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [transitions, setTransitions] = useState<Record<string, StatusItem[]>>({});

  useEffect(() => {
    dispatch(getShops(''));
    statusAPI.getAll().then((res: any) => {
      res.forEach((s: StatusItem) => {
        statusAPI.getTransitions(s.id).then((t: any) => {
          setTransitions((prev) => ({ ...prev, [String(s.id)]: t }));
        });
      });
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getInvoices({ search: searchTerm, shopId: selectedShop }));
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm, selectedShop]);

  const handleStatusChange = async (id: string | number, statusId: string | number) => {
    await dispatch(updateInvoiceStatus({ id, statusId }));
    toast.success('Status updated successfully');
    dispatch(getInvoices({ search: searchTerm, shopId: selectedShop }));
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await dispatch(deleteInvoice(id));
      toast.success('Invoice deleted successfully');
      dispatch(getInvoices({ search: searchTerm, shopId: selectedShop }));
    }
  };

  const getStatusColor = (status: any) => {
    const name = status?.name;
    switch (name) {
      case 'PAID_IN_TIME': return 'bg-green-100 text-green-800';
      case 'PAID_LATE': return 'bg-orange-100 text-orange-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'REJECTED': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: any) => {
    const name = status?.name;
    switch (name) {
      case 'PAID_IN_TIME': return 'Paid (in time)';
      case 'PAID_LATE': return 'Paid (late)';
      case 'OVERDUE': return 'Overdue';
      case 'REJECTED': return 'Reject';
      case 'PENDING': return 'Pending';
      default: return name;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage invoices across your shops</p>
        </div>
        <Link
          to="/invoices/create"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Invoice
        </Link>
      </div>

      {/* Search and Shop Filter */}
      <div className="mt-6 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search invoice by number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Shops (Filter)</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} ({shop.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
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
                  <td colSpan={8} className="text-center py-4 text-gray-500">Loading...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">No invoices found</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="hover:text-indigo-600">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customer?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.shop ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {invoice.shop.name}
                        </span>
                      ) : invoice.customer?.shop ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {invoice.customer.shop.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      PKR {Number(invoice.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={invoice.status?.id}
                        onChange={(e) => { e.stopPropagation(); handleStatusChange(invoice.id, e.target.value); }}
                        disabled={invoice.status?.isTerminal}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(invoice.status)}`}
                      >
                        <option value={invoice.status?.id}>{getStatusLabel(invoice.status)}</option>
                        {(transitions[String(invoice.status?.id)] || []).map((s: StatusItem) => (
                          <option key={s.id} value={s.id}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
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
