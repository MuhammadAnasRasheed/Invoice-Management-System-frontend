import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { createInvoice } from '../features/invoices/invoiceSlice';
import { getCustomers } from '../features/customers/customerSlice';
import { getShops } from '../features/shops/shopSlice';
import toast from 'react-hot-toast';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const CreateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.customers);
  const { shops } = useAppSelector((state) => state.shops);
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    tax: 0,
    discount: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(getShops(''));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCustomers({ shopId: selectedShop }));
  }, [dispatch, selectedShop]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const subtotal = calculateSubtotal();
  const totalwithdiscount = (subtotal - (subtotal * (formData.discount / 100)));
  const totalwithtax = (totalwithdiscount + (totalwithdiscount * (formData.tax / 100)));

  const addItem = () => {
    setItems([...items, { description: '', quantity: 0, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleReset = () => {
    setItems([]);
    setFormData({
      customerId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      tax: 0,
      discount: 0,
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (items.length === 0 || items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error('Please add valid invoice items');
      return;
    }

    const result = await dispatch(createInvoice({
      customerId: formData.customerId,
      shopId: selectedShop !== 'all' ? selectedShop : undefined,
      items: items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      tax: Number(formData.tax),
      discount: Number(formData.discount),
      notes: formData.notes,
    }));
    
    if (createInvoice.fulfilled.match(result)) {
      toast.success('Invoice created successfully');
      navigate('/invoices');
    } else {
      toast.error(result.payload as string || 'Failed to create invoice');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create New Invoice</h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below to generate and issue a new invoice</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Invoice Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter Customers by Shop</label>
              <select
                value={selectedShop}
                onChange={(e) => {
                  setSelectedShop(e.target.value);
                  setFormData({ ...formData, customerId: '' });
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-sm"
              >
                <option value="all">All Shops</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white text-sm"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.shop ? `(${customer.shop.name})` : '(No Shop)'}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No customers found for this shop. Create a customer assigned to this shop first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm"
                required
              />
            </div>
          </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">Invoice Items</h2>
            <span className="text-xs text-gray-500 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} added</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Item Description
                  </th>
                  <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="w-24 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400 italic">
                      No items added yet. Click "+ Add Item" to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value))}
                          className="block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Unit Price"
                          value={item.unitPrice === 0 ? '' : item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                          className="block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button 
                          type="button" 
                          onClick={() => removeItem(index)} 
                          className="px-2.5 py-1 text-red-600 hover:text-red-800 text-xs font-medium rounded-md hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
            <button 
              type="button" 
              onClick={addItem} 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Totals</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-1">
                <span className="text-sm font-medium text-gray-700">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">PKR {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <label className="text-sm font-medium text-gray-700 shrink-0">Tax (%)</label>
                <div className="w-36">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.tax === 0 ? '' : formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-sm text-right text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <label className="text-sm font-medium text-gray-700 shrink-0">Discount (%)</label>
                <div className="w-36">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={formData.discount === 0 ? '' : formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    className="block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-sm text-right text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-3 mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-indigo-600">PKR {totalwithtax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-semibold text-gray-900">Notes & Terms</h2>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-500 mb-3">Add any relevant payment instructions or remarks for the customer</p>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter invoice notes here..."
                rows={5}
                className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={handleReset} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Reset
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};