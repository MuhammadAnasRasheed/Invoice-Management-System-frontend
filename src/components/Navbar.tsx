import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { clearAuth } from '../features/auth/authSlice';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearAuth());
    navigate('/login', { replace: true });
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-indigo-600' },
    { name: 'Shops', href: '/shop-registry', icon: BuildingStorefrontIcon, color: 'text-indigo-600' },
    { name: 'Customers', href: '/customers', icon: UsersIcon, color: 'text-indigo-600' },
    { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon, color: 'text-indigo-600' },
    { name: 'Create Invoice', href: '/invoices/create', icon: PlusCircleIcon, color: 'text-emerald-600' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 truncate">Invoice Manager</h1>
        )}
        {collapsed && (
          <span className="text-xl font-bold text-indigo-600">IM</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-indigo-600" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 group hover:bg-gray-50 ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? item.name : undefined}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
            {!collapsed && <span className="ml-3 text-gray-700 group-hover:text-gray-900">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer: User + Logout */}
      <div className="border-t border-gray-200 p-2">
        {!collapsed && user && (
          <div className="px-3 py-2 text-sm text-gray-600 truncate">{user.name}</div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 group ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 text-red-500 group-hover:scale-110 transition-transform duration-200" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};