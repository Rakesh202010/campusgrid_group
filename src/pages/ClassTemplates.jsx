import { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Check,
  X,
  GripVertical,
  BookOpen,
  Info,
  Sparkles
} from 'lucide-react';

const ClassTemplates = () => {
  const [grades, setGrades] = useState([
    { id: 1, name: 'Nursery', displayName: 'Nursery', order: 0 },
    { id: 2, name: 'LKG', displayName: 'LKG (Lower Kindergarten)', order: 1 },
    { id: 3, name: 'UKG', displayName: 'UKG (Upper Kindergarten)', order: 2 },
    { id: 4, name: 'Class 1', displayName: 'Class 1', order: 3 },
    { id: 5, name: 'Class 2', displayName: 'Class 2', order: 4 },
    { id: 6, name: 'Class 3', displayName: 'Class 3', order: 5 },
    { id: 7, name: 'Class 4', displayName: 'Class 4', order: 6 },
    { id: 8, name: 'Class 5', displayName: 'Class 5', order: 7 },
    { id: 9, name: 'Class 6', displayName: 'Class 6', order: 8 },
    { id: 10, name: 'Class 7', displayName: 'Class 7', order: 9 },
    { id: 11, name: 'Class 8', displayName: 'Class 8', order: 10 },
    { id: 12, name: 'Class 9', displayName: 'Class 9', order: 11 },
    { id: 13, name: 'Class 10', displayName: 'Class 10', order: 12 },
    { id: 14, name: 'Class 11', displayName: 'Class 11 (Junior College)', order: 13 },
    { id: 15, name: 'Class 12', displayName: 'Class 12 (Senior Secondary)', order: 14 },
  ]);

  const [sections, setSections] = useState([
    { id: 1, name: 'A', displayName: 'Section A' },
    { id: 2, name: 'B', displayName: 'Section B' },
    { id: 3, name: 'C', displayName: 'Section C' },
    { id: 4, name: 'D', displayName: 'Section D' },
    { id: 5, name: 'E', displayName: 'Section E' },
  ]);

  const [activeTab, setActiveTab] = useState('classes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', displayName: '' });

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    
    if (activeTab === 'classes') {
      const newGrade = {
        id: Date.now(),
        name: formData.name,
        displayName: formData.displayName || formData.name,
        order: grades.length
      };
      setGrades([...grades, newGrade]);
    } else {
      const newSection = {
        id: Date.now(),
        name: formData.name,
        displayName: formData.displayName || `Section ${formData.name}`
      };
      setSections([...sections, newSection]);
    }
    
    setFormData({ name: '', displayName: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (activeTab === 'classes') {
      setGrades(grades.filter(g => g.id !== id));
    } else {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, displayName: item.displayName });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !editingItem) return;
    
    if (activeTab === 'classes') {
      setGrades(grades.map(g => 
        g.id === editingItem.id 
          ? { ...g, name: formData.name, displayName: formData.displayName || formData.name }
          : g
      ));
    } else {
      setSections(sections.map(s => 
        s.id === editingItem.id 
          ? { ...s, name: formData.name, displayName: formData.displayName || `Section ${formData.name}` }
          : s
      ));
    }
    
    setEditingItem(null);
    setFormData({ name: '', displayName: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Layers className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">Class & Section Templates</h1>
            </div>
            <p className="text-indigo-100 max-w-lg">
              Define standard classes and sections that will be available when onboarding new schools. 
              Schools can choose from these templates during setup.
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800 font-medium">How this works</p>
          <p className="text-sm text-amber-700 mt-1">
            These templates define the available classes and sections that schools in your group can use. 
            When you onboard a new school, they will select from these options. Changes here will apply to future school onboarding.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'classes'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Classes / Grades
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                {grades.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
              activeTab === 'sections'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Layers className="w-4 h-4" />
              Sections
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                {sections.length}
              </span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {activeTab === 'classes' ? 'Available Classes' : 'Available Sections'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'classes' 
                  ? 'Define the class/grade levels for your schools'
                  : 'Define the section naming convention'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({ name: '', displayName: '' });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'classes' ? 'Class' : 'Section'}
            </button>
          </div>

          {/* Classes Grid */}
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {grades.map((grade, index) => (
                <div
                  key={grade.id}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{grade.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{grade.displayName}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(grade)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(grade.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sections Grid */}
          {activeTab === 'sections' && (
            <div className="flex flex-wrap gap-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="group bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 hover:border-violet-300 hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {section.name}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{section.displayName}</p>
                    <p className="text-xs text-slate-500">Section identifier: {section.name}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button 
                      onClick={() => handleEdit(section)}
                      className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(section.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Suggestions */}
      {activeTab === 'sections' && sections.length < 8 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h4 className="font-semibold text-slate-800">Quick Add Sections</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {['F', 'G', 'H', 'I', 'J'].filter(s => !sections.find(sec => sec.name === s)).map(letter => (
              <button
                key={letter}
                onClick={() => {
                  setSections([...sections, { 
                    id: Date.now() + Math.random(), 
                    name: letter, 
                    displayName: `Section ${letter}` 
                  }]);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors"
              >
                + Section {letter}
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
                  {editingItem ? 'Edit' : 'Add'} {activeTab === 'classes' ? 'Class' : 'Section'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({ name: '', displayName: '' });
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
                  {activeTab === 'classes' ? 'Class Name' : 'Section Name'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={activeTab === 'classes' ? 'e.g., Class 1' : 'e.g., A'}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Display Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder={activeTab === 'classes' ? 'e.g., First Grade' : 'e.g., Section A'}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This is how the {activeTab === 'classes' ? 'class' : 'section'} will appear to users
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  setFormData({ name: '', displayName: '' });
                }}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTemplates;

