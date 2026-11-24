import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getInvoiceById, clearCurrentInvoice } from '../features/invoices/invoiceSlice';
import { format } from 'date-fns';
import { EnvelopeIcon, MapPinIcon, PhoneIcon, BuildingStorefrontIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export const InvoiceDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentInvoice, isLoading } = useAppSelector((state) => state.invoices);

  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }
    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

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

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!currentInvoice) {
    return <div className="text-center py-10 text-gray-500">Invoice not found</div>;
  }

  const shop = currentInvoice.shop || currentInvoice.customer?.shop;

  return (
    <div>
      {/* Header: Invoice title + number + date/status boxes */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">Invoice No: {currentInvoice.invoiceNumber}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Issue Date</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {format(new Date(currentInvoice.issueDate), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Due Date</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {format(new Date(currentInvoice.dueDate), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
          <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentInvoice.status)}`}>
            {getStatusLabel(currentInvoice.status)}
          </span>
        </div>
      </div>

      {/* Bill From / Bill To boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Bill From</h3>
          {shop ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-sm text-gray-900">{shop.name}</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <span className="text-sm text-gray-900">
                  {shop.address}, {shop.city}, {shop.country}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Your Business</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Bill To</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{currentInvoice.customer?.name}</span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{currentInvoice.customer?.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{currentInvoice.customer?.phone}</span>
            </div>
            <div className="flex items-start">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <span className="text-sm text-gray-900">{currentInvoice.customer?.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInvoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 text-right">PKR {Number(item.unitPrice).toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 text-right">PKR {Number(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment / Totals Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Payment</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Subtotal</td>
                <td className="px-6 py-3 text-sm text-gray-900 text-right">PKR {Number(currentInvoice.subtotal).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Tax ({currentInvoice.tax}%)</td>
                <td className="px-6 py-3 text-sm text-gray-900 text-right">+PKR {((Number(currentInvoice.subtotal) * Number(currentInvoice.tax)) / 100).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-sm font-medium text-gray-700">Discount ({currentInvoice.discount}%)</td>
                <td className="px-6 py-3 text-sm text-gray-900 text-right">-PKR {((Number(currentInvoice.subtotal) * Number(currentInvoice.discount)) / 100).toFixed(2)}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-6 py-3 text-base font-bold text-gray-900">Total</td>
                <td className="px-6 py-3 text-base font-bold text-indigo-600 text-right">PKR {Number(currentInvoice.total).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Status History */}
      {currentInvoice.statusHistory && currentInvoice.statusHistory.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Status History</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {[...currentInvoice.statusHistory]
              .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
              .map((h) => (
                <li key={h.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {h.fromStatus ? (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(h.fromStatus)}`}>
                        {getStatusLabel(h.fromStatus)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Created</span>
                    )}
                    <span className="text-gray-400">→</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(h.toStatus)}`}>
                      {getStatusLabel(h.toStatus)}
                    </span>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{h.changedBy?.name || 'System'}</div>
                    <div>{format(new Date(h.changedAt), 'MMM dd, yyyy HH:mm')}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {currentInvoice.notes && (
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">{currentInvoice.notes}</p>
        </div>
      )}
    </div>
  );
};
