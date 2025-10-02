import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data and logout function from AppContext
  const { user, logout, isAuthenticated } = useContext(AppContext);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add subtle shadow/blur on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout(); // Use logout function from AppContext
    setIsProfileOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 border-b border-slate-700/50 transition-colors duration-300 ${
      scrolled ? 'bg-[#0F172A] backdrop-blur-md shadow-xl' : 'bg-[#0F172A] shadow-2xl'
    }`}>
      <div className="w-full mx-auto px-4 sm:px-6 ">
        <div className="flex justify-between items-center h-16 lg:h-18">
        
          {/* Enhanced Logo - Same as Home.jsx */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-slate-700/50">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg lg:text-xl text-white group-hover:text-slate-200 transition-all duration-300">
                BusTrac
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:block">Smart Transportation</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className=" text-xl hidden lg:flex items-center gap-20 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className={`relative font-semibold transition-all duration-300 group ${isActive('/') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
              <span>Home</span>
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-white to-slate-200 transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
            </Link>
            <Link to="/smart-search" className={`relative font-semibold transition-all duration-300 group ${isActive('/smart-search') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
              <span>Find Bus</span>
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-white to-slate-200 transition-all duration-300 ${isActive('/smart-search') ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
            </Link>
            <Link to="/track" className={`relative font-semibold transition-all duration-300 group ${isActive('/track') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
              <span>Track Bus</span>
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-white to-slate-200 transition-all duration-300 ${isActive('/track') ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
            </Link>
            <Link to="/routes" className={`relative font-semibold transition-all duration-300 group ${isActive('/routes') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
              <span>Routes</span>
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-white to-slate-200 transition-all duration-300 ${isActive('/routes') ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
            </Link>
          </div>

          {/* Right Side - Profile Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Simple CTA */}
            <Link
              to="/smart-search"
              className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold border border-white/10 hover:from-sky-500 hover:to-teal-500 transition-all duration-300 shadow"
            >
              <Bus className="w-4 h-4" />
              Find Bus
            </Link>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 border border-slate-500/50">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {isAuthenticated() && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                  )}
                </div>
                {isAuthenticated() && (
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs text-slate-300">Online</div>
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 py-2 z-50">
                  {isAuthenticated() ? (
                    <>
                      {/* Logged In User Info */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user?.name || 'User Name'}</div>
                            <div className="text-sm text-slate-500">{user?.email || 'user@example.com'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Logged In Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Settings</span>
                        </Link>
                        <hr className="my-2 border-slate-200/50" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Not Logged In - Login/Signup Options */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">Welcome to BusTrac</div>
                            <div className="text-sm text-slate-500">Please sign in to continue</div>
                          </div>
                        </div>
                      </div>

                      {/* Login/Signup Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="font-medium">Sign In</span>
                        </Link>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Create Account</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar (Left slide-in) */}
        <div className={`lg:hidden fixed inset-0 z-40 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside
            className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-700/50">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-700/50">
                  <Bus className="w-4 h-4" />
                </span>
                BusTrac
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="py-3">
              <Link
                to="/"
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/smart-search"
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Bus
              </Link>
              <Link
                to="/track"
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Bus
              </Link>
              <Link
                to="/routes"
                className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Routes
              </Link>

              {isAuthenticated() ? (
                <div className="pt-4 border-t border-slate-700/50 mt-4">
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg border border-slate-500/50">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{user?.name || 'User'}</div>
                      <div className="text-sm text-slate-300">{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 font-semibold transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-700/50 mt-4 px-4">
                  <Link
                    to="/login"
                    className="block w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-slate-500 hover:to-slate-600 transition-all duration-300 shadow-lg text-center border border-slate-500/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </aside>
        </div>
      </div>
    </nav>
  );
}
;

export default Navbar;
