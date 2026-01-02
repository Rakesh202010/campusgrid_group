import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
  School,
  BookOpen,
  Layers,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';

const API_URL = 'http://localhost:4001';

const GroupDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeSchools: 0,
  });

  const token = localStorage.getItem('groupAdmin_token');
  
  const [userInfo] = useState(() => {
    const stored = localStorage.getItem('groupAdmin_info');
    return stored ? JSON.parse(stored) : { name: 'Admin', groupName: 'Your Group', groupId: '' };
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const groupInfo = JSON.parse(localStorage.getItem('groupAdmin_info') || '{}');
      const groupId = groupInfo.groupId;

      if (!groupId) {
        setError('Group ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/schools?groupId=${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        const schoolsList = data.data || [];
        setSchools(schoolsList);
        
        // Calculate stats
        const activeSchools = schoolsList.filter(s => s.status?.toLowerCase() === 'active').length;
        const totalStudents = schoolsList.reduce((sum, s) => sum + (s._count?.students || 0), 0);
        const totalTeachers = schoolsList.reduce((sum, s) => sum + (s._count?.teachers || 0), 0);
        
        setStats({
          totalSchools: schoolsList.length,
          totalStudents,
          totalTeachers,
          activeSchools,
        });
      } else {
        setError(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const quickActions = [
    {
      title: 'Onboard New School',
      description: 'Add a new school to your group',
      icon: Plus,
      color: 'from-indigo-500 to-violet-500',
      onClick: () => navigate('/schools/create'),
    },
    {
      title: 'View All Schools',
      description: 'Manage your existing schools',
      icon: Building2,
      color: 'from-emerald-500 to-teal-500',
      onClick: () => navigate('/schools'),
    },
    {
      title: 'Class Templates',
      description: 'Configure standard classes',
      icon: Layers,
      color: 'from-amber-500 to-orange-500',
      onClick: () => navigate('/class-templates'),
    },
    {
      title: 'Subject Templates',
      description: 'Manage subject list',
      icon: BookOpen,
      color: 'from-rose-500 to-pink-500',
      onClick: () => navigate('/subject-templates'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0xMC0xMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0wIDEwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-indigo-200 text-sm font-medium">Welcome back!</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{userInfo.name}</h1>
              <p className="text-indigo-100 flex items-center gap-2">
                <School className="w-4 h-4" />
                {userInfo.groupName} • School Group Portal
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all backdrop-blur-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-rose-800 font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-sm text-rose-600 hover:underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {stats.activeSchools} active
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalSchools}</p>
          <p className="text-sm text-slate-500 mt-1">Total Schools</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-violet-100 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-violet-600" />
            </div>
            <Activity className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalStudents.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Total Students</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <Activity className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalTeachers}</p>
          <p className="text-sm text-slate-500 mt-1">Total Teachers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {stats.totalSchools > 0 ? Math.round((stats.activeSchools / stats.totalSchools) * 100) : 0}%
          </p>
          <p className="text-sm text-slate-500 mt-1">Active Rate</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
            <p className="text-sm text-slate-500 mt-1">Common tasks you can perform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="group p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-left"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-500">{action.description}</p>
                <div className="flex items-center gap-1 mt-3 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Get started <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schools List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Your Schools</h2>
              <p className="text-sm text-slate-500 mt-1">Overview of all schools in your group</p>
            </div>
            <button
              onClick={() => navigate('/schools')}
              className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {schools.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Schools Yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Start by onboarding your first school to begin managing your educational group.
            </p>
            <button
              onClick={() => navigate('/schools/create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Onboard First School
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {schools.slice(0, 5).map((school) => (
              <div key={school.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {(school.schoolName || school.name || 'S').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800 truncate">
                        {school.schoolName || school.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        school.status?.toLowerCase() === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {school.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {school.city}, {school.state} • {school.schoolCode}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">{school._count?.students || 0}</p>
                      <p className="text-xs text-slate-400">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">{school._count?.teachers || 0}</p>
                      <p className="text-xs text-slate-400">Teachers</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started Guide for new users */}
      {schools.length === 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Getting Started Guide</h3>
              <p className="text-slate-600 mb-4">
                Welcome to CampusGrid! Here's how to set up your school group:
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span className="text-slate-600"><strong>Set up templates</strong> - Configure standard classes and subjects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span className="text-slate-600"><strong>Onboard schools</strong> - Add your first school with admin credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span className="text-slate-600"><strong>Share access</strong> - Give login details to school administrators</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;
