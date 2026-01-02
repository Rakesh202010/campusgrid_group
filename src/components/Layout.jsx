import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  School,
  BookOpen,
  Layers,
  HelpCircle,
  User,
  ChevronRight
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const [userInfo] = useState(() => {
    const stored = localStorage.getItem('groupAdmin_info');
    return stored ? JSON.parse(stored) : { name: 'Admin', email: 'admin@group.com', groupName: 'Your Group' };
  });

  // Simplified navigation for School Group Admin
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Quick Stats'
    },
    { 
      name: 'My Schools', 
      href: '/schools', 
      icon: Building2,
      description: 'Manage all schools'
    },
    { 
      name: 'Class Templates', 
      href: '/class-templates', 
      icon: Layers,
      description: 'Standard classes & sections'
    },
    { 
      name: 'Subject Templates', 
      href: '/subject-templates', 
      icon: BookOpen,
      description: 'Standard subjects list'
    },
  ];

  const settingsNav = [
    { 
      name: 'Group Settings', 
      href: '/settings', 
      icon: SettingsIcon,
      description: 'Configure your group'
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('groupAdmin_token');
    localStorage.removeItem('groupAdmin_info');
    navigate('/login');
  };

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href || 
                     (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
    
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
            {item.name}
          </p>
          <p className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
            {item.description}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white/70' : 'text-slate-300'}`} />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                  <School className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    CampusGrid
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">School Group Portal</p>
                </div>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Help Button */}
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-slate-800">{userInfo.name}</p>
                    <p className="text-xs text-slate-500">{userInfo.groupName}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                    {userInfo.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{userInfo.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{userInfo.email}</p>
                        <div className="mt-2 px-2 py-1 bg-indigo-50 rounded-lg inline-block">
                          <p className="text-xs font-medium text-indigo-600">{userInfo.groupName}</p>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <SettingsIcon className="w-4 h-4 text-slate-400" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="h-full overflow-y-auto p-4 flex flex-col">
            {/* Main Navigation */}
            <div className="space-y-1.5">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Main Menu
              </p>
              {navigation.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
            </div>

            {/* Settings Section */}
            <div className="mt-6 space-y-1.5">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Configuration
              </p>
              {settingsNav.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={() => setSidebarOpen(false)} 
                />
              ))}
            </div>

            {/* Help Card */}
            <div className="mt-auto pt-6">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Need Help?</p>
                    <p className="text-xs text-slate-500">We're here to assist</p>
                  </div>
                </div>
                <button className="w-full py-2 px-3 bg-white text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors border border-indigo-200">
                  Contact Support
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
