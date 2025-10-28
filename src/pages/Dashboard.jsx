import { 
  Users, 
  UserCog, 
  BookOpen, 
  TrendingUp,
  Award,
  DollarSign,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    classes: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [error, setError] = useState('');

  // Get group info from localStorage
  const groupInfo = JSON.parse(localStorage.getItem('groupAdmin_info') || '{}');
  const token = localStorage.getItem('groupAdmin_token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost:4001/api/data/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.data);

      // Fetch recent students
      const studentsResponse = await fetch('http://localhost:4001/api/data/students?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students');
      }

      const studentsData = await studentsResponse.json();
      setRecentStudents(studentsData.data || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.students,
      change: null,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: stats.teachers,
      change: null,
      icon: UserCog,
      color: 'bg-green-500',
    },
    {
      title: 'Courses',
      value: stats.courses,
      change: null,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Classes',
      value: stats.classes,
      change: null,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button onClick={fetchDashboardData} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {groupInfo.name}!</h1>
        <p className="text-blue-100">Managing {groupInfo.groupName} - {groupInfo.displayName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change} from last month
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Students</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{student.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{student.email || 'N/A'}</p>
                  </div>
                  {student.class && (
                    <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {student.class}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No students yet. Start adding students to your school!</p>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Group Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Group Name:</span>
              <span className="font-semibold text-gray-900">{groupInfo.groupName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Subdomain:</span>
              <span className="font-semibold text-gray-900">{groupInfo.subdomain}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Students:</span>
              <span className="font-semibold text-blue-600">{stats.students}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Teachers:</span>
              <span className="font-semibold text-green-600">{stats.teachers}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Active Courses:</span>
              <span className="font-semibold text-purple-600">{stats.courses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary w-full text-left px-6 py-4 flex items-center gap-3">
            <Users className="w-5 h-5" />
            Add New Student
          </button>
          <button className="btn-secondary w-full text-left px-6 py-4 flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            Create Course
          </button>
          <button className="btn-secondary w-full text-left px-6 py-4 flex items-center gap-3">
            <UserCog className="w-5 h-5" />
            Add Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
