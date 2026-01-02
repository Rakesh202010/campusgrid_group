import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin,
  Users,
  GraduationCap,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Schools = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError('');
      
      const groupInfo = localStorage.getItem('groupAdmin_info');
      let groupId = null;
      
      if (groupInfo) {
        const parsed = JSON.parse(groupInfo);
        groupId = parsed.groupId;
      }
      
      const API_BASE_URL = 'http://localhost:4001';
      const token = localStorage.getItem('groupAdmin_token');
      
      const response = await fetch(`${API_BASE_URL}/api/schools${groupId ? `?groupId=${groupId}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSchools(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch schools');
      }
    } catch (err) {
      console.error('Fetch schools error:', err);
      setError('Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schoolId) => {
    try {
      setDeleting(true);
      const API_BASE_URL = 'http://localhost:4001';
      const token = localStorage.getItem('groupAdmin_token');
      
      const response = await fetch(`${API_BASE_URL}/api/schools/${schoolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSchools(schools.filter(s => s.id !== schoolId));
        setShowDeleteConfirm(null);
      } else {
        alert(data.message || 'Failed to delete school');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete school');
    } finally {
      setDeleting(false);
    }
  };

  const filteredSchools = schools.filter(school => {
    const schoolName = school.schoolName || school.name || '';
    const location = `${school.city || ''}, ${school.state || ''}`.toLowerCase();
    const code = school.schoolCode || '';
    const matchesSearch = schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.includes(searchTerm.toLowerCase()) ||
                         code.toLowerCase().includes(searchTerm.toLowerCase());
    const schoolStatus = (school.status || 'active').toLowerCase();
    const matchesStatus = filterStatus === 'all' || schoolStatus === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: schools.length,
    active: schools.filter(s => (s.status || 'active').toLowerCase() === 'active').length,
    inactive: schools.filter(s => (s.status || '').toLowerCase() === 'inactive').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">Schools Management</h1>
            </div>
            <p className="text-indigo-100">
              Manage all schools under your group • {schools.length} {schools.length === 1 ? 'school' : 'schools'}
            </p>
          </div>
          <button
            onClick={() => navigate('/schools/create')}
            className="bg-white text-indigo-600 px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Onboard New School
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Schools</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{schools.length}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {schools.reduce((sum, school) => sum + (school._count?.students || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-violet-100 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Teachers</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {schools.reduce((sum, school) => sum + (school._count?.teachers || 0), 0)}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by school name, code, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all capitalize ${
                  filterStatus === status
                    ? status === 'active' ? 'bg-emerald-600 text-white' 
                      : status === 'inactive' ? 'bg-rose-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchSchools}
            disabled={loading}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading schools...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div>
            <p className="text-rose-800 font-medium">{error}</p>
            <button
              onClick={fetchSchools}
              className="mt-2 text-sm text-rose-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSchools.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No Schools Found' : 'No Schools Yet'}
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by onboarding your first school to the group'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/schools/create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Onboard First School
              </button>
            )}
          </div>
        </div>
      )}

      {/* Schools Grid */}
      {!loading && !error && filteredSchools.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSchools.map((school) => (
            <div 
              key={school.id} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                    {(school.schoolName || school.name || 'S').charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 truncate">
                          {school.schoolName || school.name}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {school.city}, {school.state}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        (school.status || 'active').toLowerCase() === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {(school.status || 'Active')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="text-slate-500">
                        Code: <span className="font-medium text-slate-700">{school.schoolCode}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        {school.schoolType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-600">Students</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 mt-1">{school._count?.students || 0}</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-600">Teachers</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 mt-1">{school._count?.teachers || 0}</p>
                  </div>
                </div>

                {/* Contact Info */}
                {(school.primaryContactEmail || school.primaryContactPhone) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-sm">
                    {school.primaryContactEmail && (
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-4 h-4" />
                        {school.primaryContactEmail}
                      </span>
                    )}
                    {school.primaryContactPhone && (
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-4 h-4" />
                        {school.primaryContactPhone}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(school)}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Delete School?</h3>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{showDeleteConfirm.schoolName || showDeleteConfirm.name}</strong>? 
                This action cannot be undone and will remove all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  disabled={deleting}
                  className="flex-1 py-3 px-4 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schools;
