import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getInvoiceById, clearCurrentInvoice } from '../features/invoices/invoiceSlice';
import { format } from 'date-fns';
import type { InvoiceStatus } from '../types';
import { ArrowLeftIcon,EnvelopeIcon,MapPinIcon,PhoneIcon } from '@heroicons/react/24/outline';

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

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!currentInvoice) {
    return <div className="text-center py-10 text-gray-500">Invoice not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/invoices" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Invoices
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Invoice NO :- {currentInvoice.invoiceNumber}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentInvoice.status)}`}>
              {currentInvoice.status}
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">From:</h3>
              <p className="mt-1 text-sm text-gray-900">Your Business Name</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bill To:</h3>
              <p className="mt-1 mb-3 text-sm text-gray-900 font-medium">{currentInvoice.customer?.name}</p>
              <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{currentInvoice.customer.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{currentInvoice.customer.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-900">{currentInvoice.customer.address}</span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Issue Date:</h3>
              <p className="mt-1 text-sm text-gray-900">{format(new Date(currentInvoice.issueDate), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date:</h3>
              <p className="mt-1 text-sm text-gray-900">{format(new Date(currentInvoice.dueDate), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">PKR {Number(item.unitPrice).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">PKR {Number(item.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Subtotal:</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">PKR {Number(currentInvoice.subtotal).toFixed(2)}</td>
                </tr>
                {Number(currentInvoice.tax) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Tax:</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">PKR {Number(currentInvoice.tax).toFixed(2)}</td>
                  </tr>
                )}
                {Number(currentInvoice.discount) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Discount:</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">PKR {Number(currentInvoice.discount).toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t-2">
                  <td colSpan={3} className="px-4 py-3 text-base font-bold text-gray-900 text-right">Total:</td>
                  <td className="px-4 py-3 text-base font-bold text-gray-900 text-right">PKR {Number(currentInvoice.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {currentInvoice.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Notes:</h3>
              <p className="mt-1 text-sm text-gray-600">{currentInvoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};