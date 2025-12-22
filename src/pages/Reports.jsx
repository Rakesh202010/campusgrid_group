import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp, 
  Users,
  Building2,
  GraduationCap,
  DollarSign,
  Calendar,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'academic', name: 'Academic Performance', icon: GraduationCap },
    { id: 'attendance', name: 'Attendance', icon: Users },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'enrollment', name: 'Enrollment Trends', icon: TrendingUp },
  ];

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  const quickStats = [
    {
      label: 'Total Schools',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Building2,
      color: 'blue'
    },
    {
      label: 'Total Students',
      value: '5,847',
      change: '+156',
      trend: 'up',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      label: 'Total Teachers',
      value: '348',
      change: '+12',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      label: 'Avg. Attendance',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Reports & Analytics
            </h1>
            <p className="text-blue-100">Comprehensive insights across all your schools</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>{period.name}</option>
                ))}
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const bgColors = {
            blue: 'bg-blue-100',
            purple: 'bg-purple-100',
            green: 'bg-green-100',
            orange: 'bg-orange-100'
          };
          const textColors = {
            blue: 'text-blue-600',
            purple: 'text-purple-600',
            green: 'text-green-600',
            orange: 'text-orange-600'
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`${bgColors[stat.color]} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${textColors[stat.color]}`} />
                </div>
                <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {reportTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedReport === type.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedReport === type.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-semibold text-center ${
                  selectedReport === type.id ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {type.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Student Enrollment Trend</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Chart Visualization</p>
              <p className="text-sm text-gray-400 mt-1">Interactive chart will appear here</p>
            </div>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-purple-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Chart Visualization</p>
              <p className="text-sm text-gray-400 mt-1">Interactive chart will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">School-wise Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  School Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Teachers
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Greenwood High School', students: 450, teachers: 35, attendance: '95.2%', performance: 'Excellent' },
                { name: 'Riverside Academy', students: 380, teachers: 28, attendance: '93.8%', performance: 'Good' },
                { name: 'Mountain View School', students: 520, teachers: 42, attendance: '94.5%', performance: 'Excellent' },
                { name: 'Oakwood International', students: 610, teachers: 48, attendance: '92.1%', performance: 'Good' },
              ].map((school, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{school.name}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {school.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {school.teachers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {school.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      school.performance === 'Excellent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {school.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

