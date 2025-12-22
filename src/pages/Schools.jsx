import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Users,
  GraduationCap,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Loader2
} from 'lucide-react';

const Schools = () => {
  const navigate = useNavigate();
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    principal: '',
    email: '',
    phone: '',
    established: ''
  });

  // Fetch schools from API
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

  const filteredSchools = schools.filter(school => {
    const schoolName = school.schoolName || school.name || '';
    const location = `${school.city || ''}, ${school.state || ''}`.toLowerCase();
    const matchesSearch = schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.includes(searchTerm.toLowerCase());
    const schoolStatus = (school.status || '').toLowerCase();
    const matchesStatus = filterStatus === 'all' || schoolStatus === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddSchool = (e) => {
    e.preventDefault();
    const newSchool = {
      id: schools.length + 1,
      ...formData,
      students: 0,
      teachers: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setSchools([newSchool, ...schools]);
    setShowAddSchool(false);
    setFormData({
      name: '',
      location: '',
      address: '',
      principal: '',
      email: '',
      phone: '',
      established: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              Schools Management
            </h1>
            <p className="text-blue-100">Manage all schools under your group</p>
          </div>
          <button
            onClick={() => navigate('/schools/create')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New School
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Schools</p>
              <p className="text-3xl font-bold text-gray-900">{schools.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Active Schools</p>
              <p className="text-3xl font-bold text-gray-900">
                {schools.filter(s => (s.status || '').toLowerCase() === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {schools.reduce((sum, school) => sum + (school._count?.students || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">
                {schools.reduce((sum, school) => sum + (school._count?.teachers || 0), 0)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({schools.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'active'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active ({schools.filter(s => (s.status || '').toLowerCase() === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filterStatus === 'inactive'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inactive ({schools.filter(s => (s.status || '').toLowerCase() === 'inactive').length})
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading schools...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchSchools}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSchools.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Schools Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by onboarding your first school'}
            </p>
            <button
              onClick={() => navigate('/schools/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Onboard First School
            </button>
          </div>
        </div>
      )}

      {/* Schools List */}
      {!loading && !error && filteredSchools.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 gap-px bg-gray-200">
            {filteredSchools.map((school) => (
              <div key={school.id} className="bg-white p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{school.schoolName || school.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (school.status || '').toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {(school.status || '').toLowerCase() === 'active' ? (
                              <><CheckCircle className="w-3 h-3 inline mr-1" />Active</>
                            ) : (
                              <><XCircle className="w-3 h-3 inline mr-1" />Inactive</>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{school.addressLine1}, {school.city}, {school.state}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Code: {school.schoolCode} | Type: {school.schoolType}
                        </p>
                      </div>

                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600">Students</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{school._count?.students || 0}</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">Teachers</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{school._count?.teachers || 0}</p>
                      </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-600">Email</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{school.email}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-orange-600">Phone</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{school.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Add School Modal */}
      {showAddSchool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New School</h2>
              <button
                onClick={() => setShowAddSchool(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="City, State"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="Complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Principal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="Enter principal's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year Established *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="YYYY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="school@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Add School
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSchool(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schools;

