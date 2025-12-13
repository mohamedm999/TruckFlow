import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Container,
  Map, 
  Wrench, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.CHAUFFEUR] },
    { name: 'Camions', path: '/trucks', icon: <Truck size={20} />, roles: [UserRole.ADMIN] },
    { name: 'Remorques', path: '/trailers', icon: <Container size={20} />, roles: [UserRole.ADMIN] },
    { name: 'Trajets', path: '/trips', icon: <Map size={20} />, roles: [UserRole.ADMIN, UserRole.CHAUFFEUR] },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} />, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const getPageTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    return item ? item.name : 'TruckFlow';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 p-2 rounded-lg">
               <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TruckFlow</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-8 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-orange-500 shadow-lg shadow-black/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <span className={`mr-4 ${({ isActive }: any) => isActive ? 'text-orange-500' : 'text-slate-500'}`}>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="User" className="h-full w-full object-cover" /> : <UserIcon size={20} className="text-slate-400"/>}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center">
             <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white hidden sm:block">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64 placeholder-slate-500"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-500 rounded-full border border-slate-900"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};