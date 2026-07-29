import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Warehouse, 
  Box, 
  Truck, 
  LogOut,
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Suppliers', path: '/suppliers', icon: Users },
    { name: 'Warehouses', path: '/warehouses', icon: Warehouse },
    { name: 'Inventory', path: '/inventory', icon: Box },
    { name: 'Shipments', path: '/shipments', icon: Truck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className={`bg-surface border-r border-border transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-center border-b border-border">
          <Box className="text-primary" size={28} />
          {sidebarOpen && <span className="ml-3 font-bold text-xl tracking-wide text-textMain">SCM Pro</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-textMuted hover:bg-slate-800 hover:text-textMain'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon size={20} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-300'} />
                  {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className={`flex items-center text-textMuted hover:text-danger transition-colors w-full ${!sidebarOpen ? 'justify-center' : 'px-3 py-2'}`}
            title="Logout"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-textMuted hover:text-textMain focus:outline-none">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-background border border-border text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary w-64 text-textMain"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-textMuted hover:text-textMain transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-textMain">{user?.name || 'User'}</p>
              <p className="text-xs text-textMuted">{user?.role || 'Role'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
