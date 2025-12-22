import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Check, Building2, MapPin, User, 
  GraduationCap, DollarSign, FileCheck, Upload, X, Calendar,
  Mail, Phone, Map, AlertCircle, Loader2, CheckCircle, Lock,
  Eye, EyeOff, RefreshCw, Copy, Shield
} from 'lucide-react';

const CreateSchool = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    schoolName: '',
    schoolCode: '',
    schoolType: '',
    educationBoard: '',
    academicLevel: [],
    description: '',
    logo: null,
    
    // Step 2: Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    pincode: '',
    
    // Step 3: Contact Person
    primaryContactName: '',
    primaryContactRole: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    alternateContactName: '',
    alternateContactEmail: '',
    alternatePhone: '',
    
    // Step 4: Admin Credentials
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    
    // Step 5: Academic Configuration
    academicYearStart: '',
    academicYearEnd: '',
    gradesOffered: [],
    sectionsPerGrade: [],
    gradingSystem: '',
    attendanceType: '',
    subjectsOffered: [],
    
    // Step 6: Finance Setup
    feeStructureType: '',
    billingContactEmail: '',
    paymentModes: [],
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    taxId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [copySuccess, setCopySuccess] = useState(false);

  const steps = [
    { number: 1, title: 'Basic Details', icon: Building2, description: 'School identity' },
    { number: 2, title: 'Address', icon: MapPin, description: 'Location info' },
    { number: 3, title: 'Contact Person', icon: User, description: 'Primary contact' },
    { number: 4, title: 'Admin Credentials', icon: Lock, description: 'Login setup' },
    { number: 5, title: 'Academic Setup', icon: GraduationCap, description: 'Academic config' },
    { number: 6, title: 'Finance', icon: DollarSign, description: 'Fee structure' },
    { number: 7, title: 'Review', icon: FileCheck, description: 'Confirm details' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  // Password generation function
  const generatePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}';
    const all = uppercase + lowercase + numbers + special;
    
    let password = '';
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData(prev => ({ ...prev, adminPassword: password, confirmPassword: password }));
    checkPasswordStrength(password);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, text: 'No password', color: 'bg-gray-300' });
      return;
    }
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    // Set strength based on score
    if (score <= 2) {
      setPasswordStrength({ score, text: 'Weak', color: 'bg-red-500' });
    } else if (score <= 4) {
      setPasswordStrength({ score, text: 'Medium', color: 'bg-orange-500' });
    } else {
      setPasswordStrength({ score, text: 'Strong', color: 'bg-green-500' });
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Auto-fill admin email from primary contact
  const handleContactEmailChange = (email) => {
    handleInputChange('primaryContactEmail', email);
    if (!formData.adminEmail) {
      handleInputChange('adminEmail', email);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.schoolName || !formData.schoolCode || !formData.schoolType || !formData.educationBoard) {
          setError('Please fill all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.addressLine1 || !formData.city || !formData.state || !formData.country || !formData.pincode) {
          setError('Please fill all required address fields');
          return false;
        }
        break;
      case 3:
        if (!formData.primaryContactName || !formData.primaryContactRole || !formData.primaryContactEmail || !formData.primaryContactPhone) {
          setError('Please fill all required contact fields');
          return false;
        }
        break;
      case 4:
        if (!formData.adminEmail || !formData.adminPassword) {
          setError('Please provide admin email and password');
          return false;
        }
        if (formData.adminPassword.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (!/[A-Z]/.test(formData.adminPassword) || !/[a-z]/.test(formData.adminPassword) || 
            !/[0-9]/.test(formData.adminPassword) || !/[^a-zA-Z0-9]/.test(formData.adminPassword)) {
          setError('Password must contain uppercase, lowercase, number, and special character');
          return false;
        }
        if (formData.confirmPassword && formData.adminPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 5:
        if (!formData.academicYearStart || !formData.academicYearEnd || formData.gradesOffered.length === 0 || !formData.gradingSystem) {
          setError('Please fill all required academic fields');
          return false;
        }
        break;
      case 6:
        if (!formData.feeStructureType || !formData.billingContactEmail) {
          setError('Please fill all required finance fields');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
      setError('');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = 'http://localhost:4001';
      const token = localStorage.getItem('groupAdmin_token');
      const groupInfo = localStorage.getItem('groupAdmin_info');
      
      let groupId = null;
      if (groupInfo) {
        const parsed = JSON.parse(groupInfo);
        groupId = parsed.groupId;
      }
      
      // Prepare the payload
      const payload = {
        // Basic Details
        schoolName: formData.schoolName,
        schoolCode: formData.schoolCode,
        schoolType: formData.schoolType,
        educationBoard: formData.educationBoard,
        academicLevel: formData.academicLevel,
        description: formData.description,
        logoUrl: formData.logo ? null : null, // TODO: Handle file upload
        
        // Address
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        
        // Primary Contact
        primaryContactName: formData.primaryContactName,
        primaryContactRole: formData.primaryContactRole,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone,
        alternateContactName: formData.alternateContactName,
        alternateContactEmail: formData.alternateContactEmail,
        alternatePhone: formData.alternatePhone,
        
        // Admin Credentials
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        
        // Academic Configuration
        academicYearStart: formData.academicYearStart,
        academicYearEnd: formData.academicYearEnd,
        gradesOffered: formData.gradesOffered,
        sectionsPerGrade: formData.sectionsPerGrade,
        gradingSystem: formData.gradingSystem,
        attendanceType: formData.attendanceType,
        subjectsOffered: formData.subjectsOffered,
        
        // Finance
        feeStructureType: formData.feeStructureType,
        billingContactEmail: formData.billingContactEmail,
        paymentModes: formData.paymentModes,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        taxId: formData.taxId,
        
        // Group ID
        groupId: groupId
      };

      const response = await fetch(`${API_BASE_URL}/api/schools`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        
        // Show admin credentials to user
        alert(`School created successfully!\n\nAdmin Credentials:\nEmail: ${data.data.adminCredentials.email}\nPassword: ${formData.adminPassword}\nLogin URL: ${data.data.adminCredentials.loginUrl}\n\nPlease save these credentials securely.`);
        
        setTimeout(() => {
          navigate('/schools');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create school');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to create school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails formData={formData} onChange={handleInputChange} onMultiSelect={handleMultiSelect} onFileUpload={handleFileUpload} />;
      case 2:
        return <Step2Address formData={formData} onChange={handleInputChange} />;
      case 3:
        return <Step3Contact formData={formData} onChange={handleContactEmailChange} onInputChange={handleInputChange} />;
      case 4:
        return <Step4AdminCredentials 
          formData={formData} 
          onChange={handleInputChange}
          onGenerate={generatePassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          passwordStrength={passwordStrength}
          onPasswordChange={(password) => {
            handleInputChange('adminPassword', password);
            checkPasswordStrength(password);
          }}
          onCopy={copyToClipboard}
          copySuccess={copySuccess}
        />;
      case 5:
        return <Step5Academic formData={formData} onChange={handleInputChange} onMultiSelect={handleMultiSelect} />;
      case 6:
        return <Step6Finance formData={formData} onChange={handleInputChange} onMultiSelect={handleMultiSelect} />;
      case 7:
        return <Step7Review formData={formData} onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">School Created Successfully!</h2>
          <p className="text-gray-600 mb-4">Redirecting to schools page...</p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/schools')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schools
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New School</h1>
        <p className="text-gray-600 mt-2">Complete all steps to onboard a new school</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`text-xs font-semibold hidden md:block ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </span>
                <span className="text-xs text-gray-400 hidden lg:block">{step.description}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < 7 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create School
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 1: Basic Details Component
const Step1BasicDetails = ({ formData, onChange, onMultiSelect, onFileUpload }) => {
  const schoolTypes = ['Private', 'Public', 'International', 'Government'];
  const boards = ['CBSE', 'ICSE', 'IB', 'State Board', 'IGCSE'];
  const academicLevels = ['Nursery', 'K-12', 'Primary', 'High School', 'Senior Secondary'];

  const generateSchoolCode = () => {
    const code = formData.schoolName.substring(0, 4).toUpperCase().replace(/\s/g, '');
    onChange('schoolCode', code + Math.floor(Math.random() * 1000));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🏫 Basic Details</h2>
        <p className="text-gray-600">Capture essential identity details of the school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Name */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={(e) => onChange('schoolName', e.target.value)}
            placeholder="Green Valley High School"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* School Code */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Code / Short Name <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.schoolCode}
              onChange={(e) => onChange('schoolCode', e.target.value)}
              placeholder="GVHS"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={generateSchoolCode}
              className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* School Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.schoolType}
            onChange={(e) => onChange('schoolType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            {schoolTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Education Board */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Board / Curriculum <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.educationBoard}
            onChange={(e) => onChange('educationBoard', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Board</option>
            {boards.map(board => (
              <option key={board} value={board}>{board}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Academic Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Academic Level <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {academicLevels.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => onMultiSelect('academicLevel', level)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                formData.academicLevel.includes(level)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="An English-medium CBSE school focused on holistic learning..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload School Logo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="inline-block mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium cursor-pointer hover:bg-blue-200 transition-colors"
          >
            Choose File
          </label>
          {formData.logo && (
            <p className="text-sm text-green-600 mt-2">✓ {formData.logo.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 2: Address Component
const Step2Address = ({ formData, onChange }) => {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🌍 Address Information</h2>
        <p className="text-gray-600">Capture location & contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => onChange('addressLine1', e.target.value)}
              placeholder="45 Park Street"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2
          </label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => onChange('addressLine2', e.target.value)}
            placeholder="Opp. Central Mall"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City / Town <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Bangalore"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => onChange('district', e.target.value)}
            placeholder="Bangalore Urban"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State / Province <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select State</option>
            {indianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Pincode */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode / Zip Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            placeholder="560001"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Map Preview Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-dashed border-blue-200">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Map Preview</p>
        <p className="text-sm text-gray-500 mt-1">Location will be displayed here once address is complete</p>
      </div>
    </div>
  );
};

// Step 3: Contact Person Component
const Step3Contact = ({ formData, onChange, onInputChange }) => {
  const roles = ['Principal', 'School Admin', 'Director', 'Vice Principal', 'Coordinator'];
  const handleChange = onInputChange || onChange;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">👩‍💼 Contact Person Details</h2>
        <p className="text-gray-600">Assign a primary admin / contact for the school</p>
      </div>

      {/* Primary Contact */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Primary Contact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.primaryContactName}
              onChange={(e) => handleChange('primaryContactName', e.target.value)}
              placeholder="Rajesh Sharma"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.primaryContactRole}
              onChange={(e) => handleChange('primaryContactRole', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Will be used for admin login)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.primaryContactEmail}
                onChange={(e) => onChange(e.target.value)}
                placeholder="rajesh@greenvalley.edu"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.primaryContactPhone}
                onChange={(e) => handleChange('primaryContactPhone', e.target.value)}
                placeholder="+91-9876543210"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alternate Contact */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          Alternate Contact (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.alternateContactName}
              onChange={(e) => handleChange('alternateContactName', e.target.value)}
              placeholder="Suman Patel"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.alternateContactEmail}
                onChange={(e) => handleChange('alternateContactEmail', e.target.value)}
                placeholder="suman@greenvalley.edu"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.alternatePhone}
                onChange={(e) => handleChange('alternatePhone', e.target.value)}
                placeholder="+91-9123456789"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Admin Credentials Component
const Step4AdminCredentials = ({ 
  formData, 
  onChange, 
  onGenerate, 
  showPassword, 
  setShowPassword, 
  passwordStrength, 
  onPasswordChange,
  onCopy,
  copySuccess 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          🔐 Create Login Credentials
        </h2>
        <p className="text-gray-600">Set up admin login for the school portal</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">School Admin Account</h3>
            <p className="text-sm text-gray-600">These credentials will be used to access the school portal</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Admin Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              School Admin Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => onChange('adminEmail', e.target.value)}
                placeholder="admin@springfield.edu"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-base font-medium"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Pre-filled from Primary Contact Email. You can change it if needed.
            </p>
          </div>

          {/* Auto-generated Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Auto-generated Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.adminPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Click generate to create password"
                className="w-full pl-12 pr-28 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-base font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onCopy(formData.adminPassword)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy password"
                >
                  {copySuccess ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Generate Password Button */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={onGenerate}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Generate Strong Password
              </button>
              {copySuccess && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </span>
              )}
            </div>

            {/* Password Strength Indicator */}
            {formData.adminPassword && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Password Strength:</span>
                  <span className={`text-sm font-bold ${
                    passwordStrength.text === 'Weak' ? 'text-red-600' :
                    passwordStrength.text === 'Medium' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-500`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <Check className={`w-4 h-4 ${formData.adminPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={formData.adminPassword.length >= 8 ? 'text-gray-700' : 'text-gray-400'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className={`w-4 h-4 ${/[A-Z]/.test(formData.adminPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/[A-Z]/.test(formData.adminPassword) ? 'text-gray-700' : 'text-gray-400'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className={`w-4 h-4 ${/[a-z]/.test(formData.adminPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/[a-z]/.test(formData.adminPassword) ? 'text-gray-700' : 'text-gray-400'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className={`w-4 h-4 ${/[0-9]/.test(formData.adminPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/[0-9]/.test(formData.adminPassword) ? 'text-gray-700' : 'text-gray-400'}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Check className={`w-4 h-4 ${/[^a-zA-Z0-9]/.test(formData.adminPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={/[^a-zA-Z0-9]/.test(formData.adminPassword) ? 'text-gray-700' : 'text-gray-400'}>
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                placeholder="Re-enter password to confirm"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-base font-mono"
              />
            </div>
            {formData.confirmPassword && formData.adminPassword !== formData.confirmPassword && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Passwords do not match
              </p>
            )}
            {formData.confirmPassword && formData.adminPassword === formData.confirmPassword && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-100 border-l-4 border-blue-600 p-4 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Important Information</p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>The school admin will use these credentials to login to the school portal</li>
                <li>Admin can change the password after first login</li>
                <li>Make sure to save or share these credentials securely</li>
                <li>You can view/reset credentials anytime from the Groups dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Academic Configuration Component
const Step5Academic = ({ formData, onChange, onMultiSelect }) => {
  const grades = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const gradingSystems = ['Percentage', 'GPA (10 scale)', 'GPA (4 scale)', 'Grade-based (A-F)'];
  const attendanceTypes = ['Daily', 'Period-wise', 'Hourly'];
  const commonSubjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 
                          'Computer Science', 'Physical Education', 'Art', 'Music'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎓 Academic Configuration</h2>
        <p className="text-gray-600">Setup academic session and grade structure</p>
      </div>

      {/* Academic Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year Start <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.academicYearStart}
              onChange={(e) => onChange('academicYearStart', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year End <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={formData.academicYearEnd}
              onChange={(e) => onChange('academicYearEnd', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grades Offered */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Grades / Classes Offered <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {grades.map(grade => (
            <button
              key={grade}
              type="button"
              onClick={() => onMultiSelect('gradesOffered', grade)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                formData.gradesOffered.includes(grade)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Sections per Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sections per Grade
        </label>
        <div className="flex flex-wrap gap-3">
          {sections.map(section => (
            <button
              key={section}
              type="button"
              onClick={() => onMultiSelect('sectionsPerGrade', section)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                formData.sectionsPerGrade.includes(section)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Section {section}
            </button>
          ))}
        </div>
      </div>

      {/* Grading System & Attendance Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grading System <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gradingSystem}
            onChange={(e) => onChange('gradingSystem', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select System</option>
            {gradingSystems.map(system => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.attendanceType}
            onChange={(e) => onChange('attendanceType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            {attendanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Offered */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Subjects Offered
        </label>
        <div className="flex flex-wrap gap-2">
          {commonSubjects.map(subject => (
            <button
              key={subject}
              type="button"
              onClick={() => onMultiSelect('subjectsOffered', subject)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                formData.subjectsOffered.includes(subject)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 6: Finance Setup Component
const Step6Finance = ({ formData, onChange, onMultiSelect }) => {
  const feeStructures = ['Monthly', 'Term-wise', 'Quarterly', 'Annual'];
  const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Online Payment'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Finance / Fee Setup</h2>
        <p className="text-gray-600">Collect financial preferences for the school</p>
      </div>

      {/* Fee Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fee Structure Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.feeStructureType}
            onChange={(e) => onChange('feeStructureType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Structure</option>
            {feeStructures.map(structure => (
              <option key={structure} value={structure}>{structure}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Contact Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.billingContactEmail}
              onChange={(e) => onChange('billingContactEmail', e.target.value)}
              placeholder="accounts@greenvalley.edu"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Modes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Accepted Payment Modes
        </label>
        <div className="flex flex-wrap gap-3">
          {paymentModes.map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => onMultiSelect('paymentModes', mode)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                formData.paymentModes.includes(mode)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details (Optional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
              placeholder="HDFC Bank"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => onChange('accountNumber', e.target.value)}
              placeholder="1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC / SWIFT Code
            </label>
            <input
              type="text"
              value={formData.ifscCode}
              onChange={(e) => onChange('ifscCode', e.target.value)}
              placeholder="HDFC0000123"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / GST Number
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => onChange('taxId', e.target.value)}
              placeholder="29ABCDE1234F1Z5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 7: Review & Confirmation Component
const Step7Review = ({ formData, onEdit }) => {
  const [confirmed, setConfirmed] = useState(false);

  const sections = [
    {
      title: 'Basic Details',
      step: 1,
      icon: Building2,
      data: [
        { label: 'School Name', value: formData.schoolName },
        { label: 'School Code', value: formData.schoolCode },
        { label: 'Type', value: formData.schoolType },
        { label: 'Board', value: formData.educationBoard },
        { label: 'Academic Level', value: formData.academicLevel.join(', ') },
        { label: 'Description', value: formData.description || 'N/A' }
      ]
    },
    {
      title: 'Address Information',
      step: 2,
      icon: MapPin,
      data: [
        { label: 'Address', value: `${formData.addressLine1}, ${formData.addressLine2}` },
        { label: 'City', value: formData.city },
        { label: 'State', value: formData.state },
        { label: 'Country', value: formData.country },
        { label: 'Pincode', value: formData.pincode }
      ]
    },
    {
      title: 'Primary Contact',
      step: 3,
      icon: User,
      data: [
        { label: 'Name', value: formData.primaryContactName },
        { label: 'Role', value: formData.primaryContactRole },
        { label: 'Email', value: formData.primaryContactEmail },
        { label: 'Phone', value: formData.primaryContactPhone }
      ]
    },
    {
      title: 'Admin Credentials',
      step: 4,
      icon: Lock,
      data: [
        { label: 'Admin Email', value: formData.adminEmail },
        { label: 'Password', value: formData.adminPassword ? '••••••••••••' : 'Not set', special: true },
        { label: 'Password Strength', value: formData.adminPassword ? 'Strong (Auto-generated)' : 'N/A' }
      ]
    },
    {
      title: 'Academic Configuration',
      step: 5,
      icon: GraduationCap,
      data: [
        { label: 'Academic Year', value: `${formData.academicYearStart} to ${formData.academicYearEnd}` },
        { label: 'Grades', value: formData.gradesOffered.join(', ') },
        { label: 'Sections', value: formData.sectionsPerGrade.join(', ') },
        { label: 'Grading System', value: formData.gradingSystem },
        { label: 'Attendance Type', value: formData.attendanceType },
        { label: 'Subjects', value: formData.subjectsOffered.join(', ') || 'N/A' }
      ]
    },
    {
      title: 'Finance Setup',
      step: 6,
      icon: DollarSign,
      data: [
        { label: 'Fee Structure', value: formData.feeStructureType },
        { label: 'Billing Email', value: formData.billingContactEmail },
        { label: 'Payment Modes', value: formData.paymentModes.join(', ') },
        { label: 'Bank Name', value: formData.bankName || 'N/A' },
        { label: 'Tax ID', value: formData.taxId || 'N/A' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Summary & Confirmation</h2>
        <p className="text-gray-600">Review all details before creating the school</p>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <button
                  onClick={() => onEdit(section.step)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {section.data.map((item, i) => (
                  <div key={i}>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {item.value || 'Not provided'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Checkbox */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <p className="font-semibold text-gray-900">I confirm that all the above information is accurate</p>
            <p className="text-sm text-gray-600 mt-1">
              By checking this box, you confirm that you have reviewed all the details and they are correct to the best of your knowledge.
            </p>
          </div>
        </label>
      </div>

      {!confirmed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Please confirm that all information is accurate before proceeding.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateSchool;

