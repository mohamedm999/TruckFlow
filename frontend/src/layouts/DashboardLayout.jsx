
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTruck, 
  FaTrailer, 
  FaGasPump, 
  FaRoute, 
  FaTools, 
  FaUsers, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaRing
} from 'react-icons/fa';

const SidebarItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
        isActive 
          ? 'bg-blue-700 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
             <FaTruck className="text-blue-500" />
             <span>TruckFlow</span>
          </h1>
        </div>
        
        <nav className="flex-1 mt-6">
          <SidebarItem to="/" icon={<FaTachometerAlt />} label="Dashboard" />
          
          {user?.role === 'admin' && (
             <>
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">Resources</div>
                <SidebarItem to="/trucks" icon={<FaTruck />} label="Trucks" />
                <SidebarItem to="/trailers" icon={<FaTrailer />} label="Trailers" />
                <SidebarItem to="/tires" icon={<FaRing />} label="Tires" />
                <SidebarItem to="/fuel" icon={<FaGasPump />} label="Fuel Logs" />
                
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase mt-4">Operations</div>
                <SidebarItem to="/trips" icon={<FaRoute />} label="Trips" />
                <SidebarItem to="/maintenance" icon={<FaTools />} label="Maintenance" />
                <SidebarItem to="/users" icon={<FaUsers />} label="Users" />
             </>
          )}
          
          {user?.role === 'chauffeur' && (
             <>
              <SidebarItem to="/my-trips" icon={<FaRoute />} label="My Trips" />
             </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, <strong>{user?.firstName}</strong></span>
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user?.firstName?.[0]}
                </div>
            </div>
        </header>

        <div className="p-6">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
