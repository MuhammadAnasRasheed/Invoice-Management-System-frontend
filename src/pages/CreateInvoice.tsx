import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { createInvoice } from '../features/invoices/invoiceSlice';
import { getCustomers } from '../features/customers/customerSlice';
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
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 0, unitPrice: 0 }]);
  const [formData, setFormData] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    tax: 0,
    discount: 0,
    notes: '',
  });

  useEffect(() => {
    dispatch(getCustomers(''));
  }, [dispatch]);

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Invoice</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer *</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Issue Date *</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
          
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-5">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={item.unitPrice === 0 ? '' : item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div className="col-span-2">
                <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button type="button" onClick={addItem} className="text-indigo-600 hover:text-indigo-800">
            + Add Item
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Totals</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>PKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax (%):</span>
              <input
                type="number"
                step="1"
                placeholder="Tax %"
                value={formData.tax === 0 ? '' : formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="w-32 rounded-md border-gray-300"
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Discount (%):</span>
              <input
                type="number"
                step="1"
                placeholder="Discount %"
                value={formData.discount === 0 ? '' : formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                className="w-32 rounded-md border-gray-300"
              />
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>PKR {totalwithtax.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};