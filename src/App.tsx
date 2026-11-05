import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Syringe, Sprout, Package, Users, Menu, X, Wifi, WifiOff, LineChart, RefreshCw, Beef
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOffline } from './contexts/OfflineContext';
import { ThemeToggle } from './components/ThemeToggle';
import { useAuth } from './contexts/AuthContext';
import { useTenant } from './contexts/TenantContext';

// Pages
import Dashboard from './pages/Dashboard';
import Sanitary from './pages/Sanitary';
import Crops from './pages/Crops';
import Stock from './pages/Stock';
import Team from './pages/Team';
import Animals from './pages/Animals';
import Profile from './pages/Profile';
import MarketIntelligence from './pages/MarketIntelligence';
import ChatAssistant from './components/ChatAssistant';
import Login from './pages/Login';

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-medium text-stone-500">Loading AgroTech...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Main Layout Component
function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOnline, syncQueue } = useOffline();
  const { user, signOut } = useAuth();
  const { config } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const allNavItems = [
    { id: 'dashboard', path: '/', label: 'Overview', icon: LayoutDashboard, enabled: true },
    { id: 'market', path: '/market', label: 'Market & Weather', icon: LineChart, enabled: config.features.marketIntelligence },
    { id: 'sanitary', path: '/sanitary', label: 'Health & Sanitary', icon: Syringe, enabled: config.features.sanitary },
    { id: 'crops', path: '/crops', label: 'Crops & Fields', icon: Sprout, enabled: config.features.crops },
    { id: 'stock', path: '/stock', label: 'Inventory & Stock', icon: Package, enabled: config.features.stock },
    { id: 'animals', path: '/animals', label: 'Livestock & Herd', icon: Beef, enabled: config.features.animals },
    { id: 'team', path: '/team', label: 'Team & Staff', icon: Users, enabled: config.features.team },
  ];

  const navItems = allNavItems.filter(item => item.enabled);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-4 shadow-sm border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-300"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
              <Sprout className="text-primary" size={24} />
              {config.appShortName}<span className="text-stone-900 dark:text-white">{config.appName.replace(config.appShortName, '').trim()}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              !isOnline 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                : syncQueue.length > 0
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            }`}>
              {!isOnline ? <WifiOff size={14} /> : syncQueue.length > 0 ? <RefreshCw size={14} className="animate-spin" /> : <Wifi size={14} />}
              <span className="hidden sm:inline">
                {!isOnline ? 'OFFLINE' : syncQueue.length > 0 ? `SYNC (${syncQueue.length})` : 'ONLINE'}
              </span>
            </div>
            
            <ThemeToggle />

            <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                 location.pathname === '/profile' 
                   ? 'bg-primary border-primary-light text-white shadow-md scale-105' 
                   : 'bg-stone-100 dark:bg-stone-800 border-transparent hover:border-primary text-stone-600 dark:text-stone-300'
               }`}>
                 <span className="font-bold text-sm">{user?.email?.substring(0, 2).toUpperCase() || 'US'}</span>
               </div>
            </div>
            <button onClick={signOut} className="text-sm font-semibold text-stone-500 hover:text-red-500 transition-colors">Sign Out</button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-stone-900 p-4 shadow-xl">
              <div className="mt-20 flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-white shadow-lg' 
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={24} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex max-w-7xl mx-auto">
        <aside className="hidden lg:block w-64 p-6 sticky top-20 h-[calc(100vh-5rem)]">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-primary dark:hover:text-primary hover:shadow-sm'
                }`}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8 pb-24">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      <ChatAssistant />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard onNavigate={() => {}} /></MainLayout></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MainLayout><MarketIntelligence /></MainLayout></ProtectedRoute>} />
      <Route path="/sanitary" element={<ProtectedRoute><MainLayout><Sanitary /></MainLayout></ProtectedRoute>} />
      <Route path="/crops" element={<ProtectedRoute><MainLayout><Crops /></MainLayout></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><MainLayout><Stock /></MainLayout></ProtectedRoute>} />
      <Route path="/animals" element={<ProtectedRoute><MainLayout><Animals /></MainLayout></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><MainLayout><Team /></MainLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
