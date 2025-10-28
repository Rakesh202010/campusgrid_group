import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call login API
      const response = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Store auth token and user info
      localStorage.setItem('groupAdmin_token', result.data.token);
      localStorage.setItem('groupAdmin_info', JSON.stringify({
        id: result.data.admin.id,
        name: result.data.admin.name,
        email: result.data.admin.email,
        role: result.data.admin.role,
        groupId: result.data.group.id,
        groupName: result.data.group.groupName,
        displayName: result.data.group.displayName,
        subdomain: result.data.group.subdomain,
        dbName: result.data.group.dbName,
      }));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl text-white shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                <Building2 className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">CampusGrid</h1>
                <p className="text-blue-100">Group Management Portal</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              <h2 className="text-4xl font-bold leading-tight">
                Manage Multiple Schools with Ease
              </h2>
              <p className="text-lg text-blue-100">
                Centralized platform for B2B education groups to manage all their schools, users, and operations from one powerful dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-blue-100 mt-1">Schools Managed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-blue-100 mt-1">Students & Teachers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CampusGrid</h1>
                <p className="text-sm text-gray-600">Group Portal</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Sign in to manage your school group</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="admin@yourgroup.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In to Dashboard
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have access?{' '}
                  <button className="font-semibold text-blue-600 hover:text-blue-700">
                    Contact Support
                  </button>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>🔒 Secure login with enterprise-grade encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

