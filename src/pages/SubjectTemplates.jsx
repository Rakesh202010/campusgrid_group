import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Check,
  X,
  Search,
  Info,
  Sparkles,
  Calculator,
  FlaskConical,
  Languages,
  Globe,
  Palette,
  Music,
  Dumbbell,
  Monitor,
  BookMarked
} from 'lucide-react';

const SubjectTemplates = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH', icon: 'calculator', category: 'Core', color: 'blue' },
    { id: 2, name: 'Science', code: 'SCI', icon: 'flask', category: 'Core', color: 'green' },
    { id: 3, name: 'English', code: 'ENG', icon: 'language', category: 'Language', color: 'purple' },
    { id: 4, name: 'Hindi', code: 'HIN', icon: 'language', category: 'Language', color: 'orange' },
    { id: 5, name: 'Social Studies', code: 'SST', icon: 'globe', category: 'Core', color: 'amber' },
    { id: 6, name: 'Physics', code: 'PHY', icon: 'flask', category: 'Science', color: 'cyan' },
    { id: 7, name: 'Chemistry', code: 'CHEM', icon: 'flask', category: 'Science', color: 'teal' },
    { id: 8, name: 'Biology', code: 'BIO', icon: 'flask', category: 'Science', color: 'emerald' },
    { id: 9, name: 'Computer Science', code: 'CS', icon: 'computer', category: 'Technology', color: 'indigo' },
    { id: 10, name: 'Art & Craft', code: 'ART', icon: 'palette', category: 'Creative', color: 'pink' },
    { id: 11, name: 'Music', code: 'MUS', icon: 'music', category: 'Creative', color: 'rose' },
    { id: 12, name: 'Physical Education', code: 'PE', icon: 'sports', category: 'Physical', color: 'red' },
    { id: 13, name: 'General Knowledge', code: 'GK', icon: 'book', category: 'General', color: 'slate' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', category: 'Core' });

  const categories = ['all', 'Core', 'Language', 'Science', 'Technology', 'Creative', 'Physical', 'General'];

  const iconMap = {
    calculator: Calculator,
    flask: FlaskConical,
    language: Languages,
    globe: Globe,
    palette: Palette,
    music: Music,
    sports: Dumbbell,
    computer: Monitor,
    book: BookMarked,
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    amber: 'from-amber-500 to-amber-600',
    cyan: 'from-cyan-500 to-cyan-600',
    teal: 'from-teal-500 to-teal-600',
    emerald: 'from-emerald-500 to-emerald-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    rose: 'from-rose-500 to-rose-600',
    red: 'from-red-500 to-red-600',
    slate: 'from-slate-500 to-slate-600',
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || subject.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.code.trim()) return;
    
    const newSubject = {
      id: Date.now(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      category: formData.category,
      icon: 'book',
      color: 'indigo'
    };
    setSubjects([...subjects, newSubject]);
    setFormData({ name: '', code: '', category: 'Core' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, code: item.code, category: item.category });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !formData.code.trim() || !editingItem) return;
    
    setSubjects(subjects.map(s => 
      s.id === editingItem.id 
        ? { ...s, name: formData.name, code: formData.code.toUpperCase(), category: formData.category }
        : s
    ));
    
    setEditingItem(null);
    setFormData({ name: '', code: '', category: 'Core' });
    setShowAddModal(false);
  };

  const quickAddSubjects = [
    { name: 'Environmental Studies', code: 'EVS', category: 'Core' },
    { name: 'Economics', code: 'ECO', category: 'Core' },
    { name: 'Geography', code: 'GEO', category: 'Core' },
    { name: 'History', code: 'HIS', category: 'Core' },
    { name: 'Sanskrit', code: 'SKT', category: 'Language' },
    { name: 'French', code: 'FRE', category: 'Language' },
  ].filter(s => !subjects.find(sub => sub.code === s.code));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <BookOpen className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">Subject Templates</h1>
            </div>
            <p className="text-emerald-100 max-w-lg">
              Define the standard subjects that will be available across all schools in your group.
              Schools can select from these when setting up their curriculum.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', code: '', category: 'Core' });
              setShowAddModal(true);
            }}
            className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-emerald-800 font-medium">About Subject Templates</p>
          <p className="text-sm text-emerald-700 mt-1">
            These subjects form the master list for your school group. When onboarding schools or setting up classes, 
            administrators can choose from this list. Each subject has a unique code for identification.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-2xl font-bold text-slate-800">{subjects.length}</p>
          <p className="text-sm text-slate-500">Total Subjects</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-2xl font-bold text-blue-600">{subjects.filter(s => s.category === 'Core').length}</p>
          <p className="text-sm text-slate-500">Core Subjects</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-2xl font-bold text-purple-600">{subjects.filter(s => s.category === 'Language').length}</p>
          <p className="text-sm text-slate-500">Languages</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-2xl font-bold text-emerald-600">{subjects.filter(s => s.category === 'Science').length}</p>
          <p className="text-sm text-slate-500">Science Subjects</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {selectedCategory === 'all' ? 'All Subjects' : `${selectedCategory} Subjects`}
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'})
          </span>
        </h3>

        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No subjects found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSubjects.map((subject) => {
              const IconComponent = iconMap[subject.icon] || BookMarked;
              return (
                <div
                  key={subject.id}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[subject.color] || colorClasses.indigo} rounded-xl flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-white rounded-lg text-slate-600 border border-slate-200">
                      {subject.code}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{subject.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">Category: {subject.category}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(subject)}
                      className="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject.id)}
                      className="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Add Suggestions */}
      {quickAddSubjects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h4 className="font-semibold text-slate-800">Suggested Subjects</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickAddSubjects.map(subject => (
              <button
                key={subject.code}
                onClick={() => {
                  setSubjects([...subjects, { 
                    id: Date.now() + Math.random(), 
                    ...subject,
                    icon: 'book',
                    color: 'indigo'
                  }]);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-emerald-100 hover:text-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  {editingItem ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({ name: '', code: '', category: 'Core' });
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., MATH"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all uppercase"
                />
                <p className="text-xs text-slate-500 mt-2">
                  A unique short code for identification (max 6 characters)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  setFormData({ name: '', code: '', category: 'Core' });
                }}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingItem ? 'Update' : 'Add Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTemplates;

