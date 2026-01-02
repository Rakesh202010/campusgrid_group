import { 
  Users, 
  UserCog, 
  GraduationCap, 
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
  RefreshCw,
  UserPlus,
  BookOpen,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Activity,
  Target,
  School
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4001';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Get group info from localStorage
  const groupInfo = JSON.parse(localStorage.getItem('groupAdmin_info') || '{}');
  const token = localStorage.getItem('groupAdmin_token');

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchDashboardData();
    }
  }, [selectedSchool]);

  const fetchSchools = async () => {
    try {
      // Get groupId from localStorage
      const groupId = groupInfo.groupId;
      const queryParam = groupId ? `?groupId=${groupId}` : '';
      
      const response = await fetch(`${API_URL}/api/schools${queryParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success && data.data?.length > 0) {
        setSchools(data.data);
        // Auto-select first school or get from localStorage
        const savedSchoolId = localStorage.getItem('selectedSchoolId');
        const school = savedSchoolId 
          ? data.data.find(s => s.id === savedSchoolId) || data.data[0]
          : data.data[0];
        setSelectedSchool(school);
        localStorage.setItem('selectedSchoolId', school.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedSchool) return;
    
    setRefreshing(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-school-id': selectedSchool.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Failed to load dashboard');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSchoolChange = (school) => {
    setSelectedSchool(school);
    localStorage.setItem('selectedSchoolId', school.id);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'active') return 'bg-emerald-100 text-emerald-700';
    if (statusLower === 'inactive') return 'bg-gray-100 text-gray-700';
    if (statusLower === 'on_leave') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  // Calculate percentage for progress bars
  const getPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        </div>
        <p className="mt-6 text-lg text-gray-600 font-medium">Loading your dashboard...</p>
        <p className="mt-2 text-sm text-gray-400">Please wait while we fetch the latest data</p>
      </div>
    );
  }

  if (!selectedSchool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
          <School className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Schools Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't created any schools yet. Create your first school to start managing students, teachers, and more.
        </p>
        <button 
          onClick={() => navigate('/schools/create')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Building2 className="w-5 h-5" />
          Create Your First School
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Failed to load dashboard</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Retry
        </button>
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const genderDist = dashboardData?.genderDistribution || {};
  const classDist = dashboardData?.classDistribution || [];
  const deptDist = dashboardData?.departmentDistribution || [];
  const recentStudents = dashboardData?.recentStudents || [];
  const recentTeachers = dashboardData?.recentTeachers || [];
  const currentSession = dashboardData?.currentSession;

  const totalGender = (genderDist.male || 0) + (genderDist.female || 0) + (genderDist.other || 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-white/80 text-sm font-medium">Welcome back</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{groupInfo.name || 'Admin'}</h1>
              <p className="text-white/70 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {groupInfo.groupName || 'School Group'} Dashboard
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* School Selector */}
              {schools.length > 1 && (
                <select
                  value={selectedSchool?.id || ''}
                  onChange={(e) => handleSchoolChange(schools.find(s => s.id === e.target.value))}
                  className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {schools.map(school => (
                    <option key={school.id} value={school.id} className="text-gray-900">
                      {school.name}
                    </option>
                  ))}
                </select>
              )}
              
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Current Session Banner */}
          {currentSession && (
            <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 w-fit">
              <Calendar className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">
                Academic Session: <strong>{currentSession.name}</strong>
              </span>
              {currentSession.isCurrent && (
                <span className="px-2 py-0.5 bg-green-400/30 text-green-100 text-xs rounded-full font-medium">
                  Current
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(overview.totalStudents)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {overview.activeStudents} active
                </span>
              </div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          {overview.newStudentsThisMonth > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span><strong className="text-emerald-600">+{overview.newStudentsThisMonth}</strong> this month</span>
            </div>
          )}
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(overview.totalTeachers)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {overview.activeTeachers} active
                </span>
                {overview.teachersOnLeave > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {overview.teachersOnLeave} on leave
                  </span>
                )}
              </div>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <UserCog className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Student-Teacher Ratio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Student:Teacher Ratio</p>
              <p className="text-3xl font-bold text-gray-900">{overview.studentTeacherRatio || '0'}:1</p>
              <p className="text-sm text-gray-500 mt-2">
                {overview.studentTeacherRatio <= 20 ? (
                  <span className="text-emerald-600 font-medium">✓ Healthy ratio</span>
                ) : overview.studentTeacherRatio <= 30 ? (
                  <span className="text-amber-600 font-medium">⚠ Moderate</span>
                ) : (
                  <span className="text-red-600 font-medium">⚠ High ratio</span>
                )}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Fee Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fee Types</p>
              <p className="text-3xl font-bold text-gray-900">{overview.totalFeeTypes || 0}</p>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(overview.totalConfiguredFees)} configured
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Gender Distribution</h3>
                <p className="text-sm text-gray-500">{totalGender} students total</p>
              </div>
            </div>
          </div>
          
          {totalGender > 0 ? (
            <div className="space-y-4">
              {/* Visual Bar */}
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-500 transition-all duration-500" 
                  style={{ width: `${getPercentage(genderDist.male, totalGender)}%` }}
                ></div>
                <div 
                  className="bg-pink-500 transition-all duration-500" 
                  style={{ width: `${getPercentage(genderDist.female, totalGender)}%` }}
                ></div>
                <div 
                  className="bg-purple-500 transition-all duration-500" 
                  style={{ width: `${getPercentage(genderDist.other, totalGender)}%` }}
                ></div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Male</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{genderDist.male || 0}</p>
                  <p className="text-xs text-gray-500">{getPercentage(genderDist.male, totalGender)}%</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Female</span>
                  </div>
                  <p className="text-2xl font-bold text-pink-600">{genderDist.female || 0}</p>
                  <p className="text-xs text-gray-500">{getPercentage(genderDist.female, totalGender)}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">Other</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{genderDist.other || 0}</p>
                  <p className="text-xs text-gray-500">{getPercentage(genderDist.other, totalGender)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No student data available</p>
            </div>
          )}
        </div>

        {/* Class Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Class-wise Students</h3>
                <p className="text-sm text-gray-500">{classDist.length} classes</p>
              </div>
            </div>
          </div>
          
          {classDist.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {classDist.map((cls, index) => {
                const maxStudents = Math.max(...classDist.map(c => c.value));
                const percentage = maxStudents > 0 ? (cls.value / maxStudents) * 100 : 0;
                const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-amber-500'];
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cls.name}</span>
                      <span className="text-sm font-bold text-gray-900">{cls.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[index % colors.length]} transition-all duration-500 group-hover:opacity-80`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No class data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Recent Students</h3>
                  <p className="text-sm text-gray-500">Latest enrollments</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/students')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentStudents.length > 0 ? (
              recentStudents.slice(0, 5).map((student, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      getInitials(student.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{student.name}</p>
                    <p className="text-sm text-gray-500 truncate">{student.admissionNumber} • {student.className}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No students enrolled yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Teachers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Recent Teachers</h3>
                  <p className="text-sm text-gray-500">Recently added staff</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/teachers')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentTeachers.length > 0 ? (
              recentTeachers.map((teacher, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {teacher.photoUrl ? (
                      <img src={teacher.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      getInitials(teacher.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{teacher.name}</p>
                    <p className="text-sm text-gray-500 truncate">{teacher.department} • {teacher.designation || 'Teacher'}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(teacher.status)}`}>
                    {teacher.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <UserCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No teachers added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      {deptDist.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Department Distribution</h3>
              <p className="text-sm text-gray-500">Teachers by department</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {deptDist.map((dept, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-purple-500 to-purple-600',
                'from-pink-500 to-pink-600',
                'from-indigo-500 to-indigo-600',
                'from-cyan-500 to-cyan-600',
                'from-teal-500 to-teal-600',
                'from-emerald-500 to-emerald-600',
                'from-amber-500 to-amber-600'
              ];
              return (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${colors[index % colors.length]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {dept.count}
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate" title={dept.name}>
                    {dept.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/students')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-medium text-gray-800">Add Student</p>
            <p className="text-sm text-gray-500">Enroll new student</p>
          </button>
          
          <button 
            onClick={() => navigate('/teachers')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
              <UserCog className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="font-medium text-gray-800">Add Teacher</p>
            <p className="text-sm text-gray-500">Add new staff member</p>
          </button>
          
          <button 
            onClick={() => navigate('/courses')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-medium text-gray-800">Manage Courses</p>
            <p className="text-sm text-gray-500">View all subjects</p>
          </button>
          
          <button 
            onClick={() => navigate('/reports')}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-medium text-gray-800">View Reports</p>
            <p className="text-sm text-gray-500">Analytics & insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
