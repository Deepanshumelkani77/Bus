import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    try {
      setLoading(true);
      // TODO: Implement actual login API call
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Navy with Blobs */}
      <div className="relative bg-slate-900 pt-20 pb-10 px-5 rounded-b-3xl overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute w-50 h-50 rounded-full bg-sky-400/20 -top-12 -right-8 animate-pulse" style={{width: '200px', height: '200px'}}></div>
        <div className="absolute w-35 h-35 rounded-full bg-teal-400/18 -bottom-8 -left-5 animate-pulse" style={{width: '140px', height: '140px', animationDelay: '1s'}}></div>
        
        {/* Hero Content */}
        <div className={`text-center relative z-10 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <h1 className="text-white/90 text-base font-bold tracking-wide mb-2">BusTracker</h1>
          
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-sky-400 rounded-full flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-white/80 text-sm">Sign in to continue</p>
        </div>
      </div>

      {/* Login Card */}
      <div className="px-5 -mt-6 relative z-20">
        <div className={`bg-white rounded-2xl p-5 shadow-lg border border-gray-100 transform transition-all duration-500 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-slate-500 text-sm mb-1.5 mt-3">Email</label>
              <input
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-slate-500 text-sm mb-1.5 mt-3">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-slate-900 text-white py-4 rounded-full font-bold text-base shadow-lg hover:bg-slate-800 transition-all duration-200 mt-5 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-slate-500 text-sm px-2">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Sign Up Link */}
            <p className="text-slate-500 text-center text-sm mt-4">
              New driver?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-slate-900 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
