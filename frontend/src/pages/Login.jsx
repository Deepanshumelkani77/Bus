import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (isSignup) {
      if (!formData.name || !formData.city) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');

      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const payload = isSignup 
        ? { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            city: formData.city 
          }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`http://localhost:2000${endpoint}`, payload);
      
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('driver', JSON.stringify(response.data.driver));
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(
        error.response?.data?.message || 
        `${isSignup ? 'Signup' : 'Login'} failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: ''
    });
    setError('');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      </div>
      
      <div className="relative h-full flex">
        {/* Left Side - Hero Section (Hidden on mobile, visible on laptop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 rounded-full bg-teal-400/10 -top-20 -left-20 animate-pulse"></div>
            <div className="absolute w-80 h-80 rounded-full bg-sky-400/10 top-1/3 -right-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute w-64 h-64 rounded-full bg-purple-400/10 bottom-20 left-1/4 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-teal-400 to-sky-400 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-8 h-8 xl:w-9 xl:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                </div>
                <h1 className="text-2xl xl:text-3xl font-bold">BusTrac</h1>
              </div>
              
              <h2 className="text-3xl xl:text-4xl font-bold mb-4 xl:mb-6 leading-tight">
                Smart Bus Tracking<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">
                  Made Simple
                </span>
              </h2>
              
              <p className="text-lg xl:text-xl text-slate-300 mb-6 xl:mb-8 leading-relaxed">
                Join thousands of drivers who trust BusTrac for efficient route management and real-time passenger updates.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm xl:text-base">Real-time GPS tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm xl:text-base">Smart route optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm xl:text-base">Passenger notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 h-full overflow-y-auto">
          <div className="w-full max-w-md flex flex-col justify-center min-h-0">
            {/* Mobile Logo (Visible only on mobile) */}
            <div className="lg:hidden text-center mb-4 sm:mb-6 flex-shrink-0">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">BusTrac</h1>
            </div>

            {/* Auth Card */}
            <div className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 transform transition-all duration-700 flex-shrink-0 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  {isSignup ? 'Join our community of drivers' : 'Sign in to your account'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Name Field - Only for Signup */}
                {isSignup && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200"
                      required={isSignup}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="driver@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>

                {/* City Field - Only for Signup */}
                {isSignup && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200"
                      required={isSignup}
                    />
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-teal-500 to-sky-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all duration-300 mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-1'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSignup ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    isSignup ? 'Create Account' : 'Sign In'
                  )}
                </button>

                {/* Toggle Mode */}
                <div className="text-center mt-4">
                  <p className="text-slate-600 text-sm">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors"
                    >
                      {isSignup ? 'Sign In' : 'Create new account'}
                    </button>
                  </p>
                </div>

                {/* Forgot Password - Only for Login */}
                {!isSignup && (
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="text-slate-500 text-sm hover:text-slate-700 hover:underline transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </form>

              {/* Terms and Conditions - Only for Signup */}
              {isSignup && (
                <p className="text-slate-500 text-xs text-center mt-4 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <span className="text-teal-600 font-medium hover:underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-teal-600 font-medium hover:underline cursor-pointer">Privacy Policy</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
