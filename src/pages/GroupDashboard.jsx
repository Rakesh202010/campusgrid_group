import { useState } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  UserCheck,
  TrendingUp,
  Plus,
  Search,
  BarChart3,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';

const GroupDashboard = () => {
  const [groupInfo] = useState(() => {
    const stored = localStorage.getItem('groupAdmin_info');
    return stored ? JSON.parse(stored) : { groupName: 'Your Group', name: 'Admin' };
  });

  // Mock data - will be replaced with API calls
  const stats = [
    {
      title: 'Total Schools',
      value: '24',
      change: '+3 this month',
      trend: 'up',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: '8,547',
      change: '+12% from last month',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Teachers',
      value: '342',
      change: '+8% from last month',
      trend: 'up',
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Active Users',
      value: '8,889',
      change: '+15% from last month',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentSchools = [
    { 
      id: 1,
      name: 'Greenwood High School', 
      location: 'New York, NY',
      students: 450,
      teachers: 35,
      status: 'active',
      createdAt: '2025-10-15'
    },
    { 
      id: 2,
      name: 'Riverside Academy', 
      location: 'Los Angeles, CA',
      students: 380,
      teachers: 28,
      status: 'active',
      createdAt: '2025-10-10'
    },
    { 
      id: 3,
      name: 'Mountain View School', 
      location: 'Denver, CO',
      students: 520,
      teachers: 42,
      status: 'active',
      createdAt: '2025-10-05'
    },
    { 
      id: 4,
      name: 'Oakwood International', 
      location: 'Chicago, IL',
      students: 610,
      teachers: 48,
      status: 'active',
      createdAt: '2025-09-28'
    }
  ];

  const topPerformingSchools = [
    { name: 'Greenwood High School', score: 95, students: 450, improvement: '+5%' },
    { name: 'Oakwood International', score: 92, students: 610, improvement: '+3%' },
    { name: 'Riverside Academy', score: 88, students: 380, improvement: '+7%' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {groupInfo.name}! 👋</h1>
            <p className="text-blue-100 text-lg">{groupInfo.groupName}</p>
            <p className="text-blue-200 text-sm mt-1">Here's what's happening with your schools today</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New School
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {stat.change.split(' ')[0]}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Schools - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recently Added Schools</h2>
                <p className="text-sm text-gray-600 mt-1">Latest schools onboarded to your group</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                View All
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100 cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{school.name}</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {school.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{school.location}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Students:</span>
                        <span className="font-semibold text-gray-900 ml-1">{school.students}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Teachers:</span>
                        <span className="font-semibold text-gray-900 ml-1">{school.teachers}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Added {new Date(school.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Schools */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
            </div>
            <p className="text-sm text-gray-600">Highest rated schools</p>
          </div>
          
          <div className="p-6 space-y-4">
            {topPerformingSchools.map((school, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{school.name}</p>
                      <p className="text-xs text-gray-500">{school.students} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{school.score}%</p>
                    <p className="text-xs text-green-600">{school.improvement}</p>
                  </div>
                </div>
                {index < topPerformingSchools.length - 1 && (
                  <div className="h-px bg-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="group p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <div className="bg-blue-100 group-hover:bg-blue-600 p-3 rounded-xl w-fit mb-3 transition-colors">
              <Plus className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Add New School</h3>
            <p className="text-sm text-gray-600">Onboard a new school to your group</p>
          </button>

          <button className="group p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
            <div className="bg-purple-100 group-hover:bg-purple-600 p-3 rounded-xl w-fit mb-3 transition-colors">
              <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage all users</p>
          </button>

          <button className="group p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left">
            <div className="bg-green-100 group-hover:bg-green-600 p-3 rounded-xl w-fit mb-3 transition-colors">
              <BarChart3 className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
            <p className="text-sm text-gray-600">Access detailed analytics</p>
          </button>

          <button className="group p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
            <div className="bg-orange-100 group-hover:bg-orange-600 p-3 rounded-xl w-fit mb-3 transition-colors">
              <DollarSign className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Billing</h3>
            <p className="text-sm text-gray-600">Manage subscriptions & payments</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDashboard;

