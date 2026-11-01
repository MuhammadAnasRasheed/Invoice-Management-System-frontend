import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { getShops, createShop, updateShop, deleteShop, clearShopError } from '../features/shops/shopSlice';
import type { Shop } from '../types';
import toast from 'react-hot-toast';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  GlobeAmericasIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const ShopRegistry = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shops, isLoading, isError, message } = useAppSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [modalFormData, setModalFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    dispatch(getShops(''));
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(clearShopError());
    }
  }, [isError, message, dispatch]);

  // Handle first shop creation (registry form)
  const handleRegistrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim() || !formData.country.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const result = await dispatch(createShop(formData));
    if (createShop.fulfilled.match(result)) {
      toast.success('Shop registered successfully!');
      setFormData({ name: '', address: '', city: '', country: '' });
      navigate('/dashboard');
    }
  };

  // Handle modal submit (create additional or update shop)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.name.trim() || !modalFormData.address.trim() || !modalFormData.city.trim() || !modalFormData.country.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingShop) {
      const result = await dispatch(updateShop({ id: editingShop.id, data: modalFormData }));
      if (updateShop.fulfilled.match(result)) {
        toast.success('Shop updated successfully');
        setIsModalOpen(false);
        setEditingShop(null);
      }
    } else {
      const result = await dispatch(createShop(modalFormData));
      if (createShop.fulfilled.match(result)) {
        toast.success('Shop registered successfully');
        setIsModalOpen(false);
      }
    }

    setModalFormData({ name: '', address: '', city: '', country: '' });
    dispatch(getShops(''));
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setModalFormData({
      name: shop.name,
      address: shop.address,
      city: shop.city,
      country: shop.country,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      const result = await dispatch(deleteShop(id));
      if (deleteShop.fulfilled.match(result)) {
        toast.success('Shop deleted successfully');
        dispatch(getShops(''));
      }
    }
  };

  const openNewShopModal = () => {
    setEditingShop(null);
    setModalFormData({ name: '', address: '', city: '', country: '' });
    setIsModalOpen(true);
  };

  // If user has NO shops registered, show initial registration form
  if (!isLoading && shops.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <BuildingStorefrontIcon className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shop Registry</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome! Please complete your shop registration to begin creating invoices and managing your business.
            </p>
          </div>

          <form onSubmit={handleRegistrySubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Traders"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Shop #12, Commercial Market, Main Blvd"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. United States"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
              >
                {isLoading ? 'Registering Shop...' : 'Register Shop & Proceed'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // If user already has shops, display them with options to edit or register another
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Shop Registry</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your registered shops and business locations
          </p>
        </div>
        <button
          onClick={openNewShopModal}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Register New Shop
        </button>
      </div>

      {isLoading && shops.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Loading shops...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BuildingStorefrontIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{shop.name}</h2>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(shop)}
                      title="Edit Shop"
                      className="text-gray-400 hover:text-indigo-600 transition"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(shop.id)}
                      title="Delete Shop"
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 shrink-0 mt-0.5" />
                    <span>{shop.address}</span>
                  </div>
                  <div className="flex items-center">
                    <GlobeAmericasIcon className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span>
                      {shop.city}, {shop.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit or Add Shop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingShop ? 'Edit Shop' : 'Register New Shop'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalFormData.address}
                  onChange={(e) => setModalFormData({ ...modalFormData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalFormData.city}
                    onChange={(e) => setModalFormData({ ...modalFormData, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalFormData.country}
                    onChange={(e) => setModalFormData({ ...modalFormData, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingShop ? 'Update Shop' : 'Register Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

