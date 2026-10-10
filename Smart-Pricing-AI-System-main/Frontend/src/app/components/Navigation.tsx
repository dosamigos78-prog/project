import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { X, Home, LogIn, Upload, CreditCard, MessageCircle, Menu, TrendingUp, LogOut, User, UserPlus } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      setUserData(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("hasPaid");
    setUserData(null);
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/data-input", icon: Upload, label: "Data Input" },
    { path: "/payment", icon: CreditCard, label: "Payment" },
    { path: "/chatbot", icon: MessageCircle, label: "AI Assistant" },
  ];

  // 💡 إضافة اللوجين والساين آب في القائمة الجانبية لو مش مسجل دخول
  if (!userData) {
    menuItems.splice(1, 0, { path: "/login", icon: LogIn, label: "Login" });
    menuItems.splice(2, 0, { path: "/signup", icon: UserPlus, label: "Sign Up" });
  }

  return (
    <>
      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black" style={{ color: 'var(--navy)' }}>
              Navigation
            </h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" style={{ color: 'var(--navy)' }} />
            </button>
          </div>

          {/* Menu Navigation */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'shadow-lg text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--coral)' : 'transparent',
                    color: isActive ? 'white' : 'var(--navy)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Menu Footer */}
          <div className="absolute bottom-8 left-6 right-6 border-t-2 border-gray-200 pt-6 text-center">
            <p className="text-sm font-bold" style={{ color: 'var(--navy-light)' }}>
              AI Pricing Platform
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--navy-light)' }}>
              © 2026 All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" style={{ color: 'var(--navy)' }} />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[var(--coral)] text-white">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-black leading-tight" style={{ color: 'var(--navy)' }}>
                    AI Pricing
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--coral)' }}>
                    Enterprise
                  </div>
                </div>
              </Link>
            </div>
            
            <div>
              {userData ? (
                // حالة الدخول (شريط المستخدم وزرار الخروج)
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--coral)' }}>
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>
                      {userData.UserName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors group flex items-center gap-1 text-red-500"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                // 💡 التعديل هنا: حالة عدم الدخول (زرارين جنب بعض)
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg font-bold transition-all hover:bg-gray-50 hidden sm:block"
                    style={{ color: 'var(--navy)' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    style={{ backgroundColor: 'var(--coral)' }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}