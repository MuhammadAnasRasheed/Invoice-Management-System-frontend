import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getCustomerById } from '../features/customers/customerSlice';
import { getInvoicesByCustomer } from '../features/invoices/invoiceSlice';
import { format } from 'date-fns';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCustomer, isLoading } = useAppSelector((state) => state.customers);
  const { customerInvoices } = useAppSelector((state) => state.invoices);

  useEffect(() => {
    if (id) {
      dispatch(getCustomerById(id));
      dispatch(getInvoicesByCustomer(id));
    }
  }, [dispatch, id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!currentCustomer) {
    return <div className="text-center py-10 text-gray-500">Customer not found</div>;
  }

  const totalSpent = customerInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const pendingAmount = customerInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{currentCustomer.name}</h1>
        {currentCustomer.shop && (
          <p className="mt-1 text-sm text-gray-500">{currentCustomer.shop.city}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Invoices</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{customerInvoices.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Spent</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">PKR {totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Pending Amount</p>
          <p className="mt-2 text-2xl font-semibold text-yellow-600">PKR {pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Contact & Shop Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{currentCustomer.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{currentCustomer.phone}</span>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <span className="text-sm text-gray-900">{currentCustomer.address}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Shop Information</h3>
          {currentCustomer.shop ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-sm text-gray-900">{currentCustomer.shop.name}</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <span className="text-sm text-gray-900">
                  {currentCustomer.shop.address}, {currentCustomer.shop.city}, {currentCustomer.shop.country}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No shop assigned</p>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">All Invoices</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No invoices found for this customer
                  </td>
                </tr>
              ) : (
                customerInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {invoice.invoiceNumber}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
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
