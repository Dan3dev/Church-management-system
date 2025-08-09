import React, { useState } from 'react';
import { Globe, Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Language } from '../../types';

interface LanguageManagerProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageManager: React.FC<LanguageManagerProps> = ({ currentLanguage, onLanguageChange }) => {
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false, isActive: true, completeness: 100 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false, isActive: true, completeness: 95 },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false, isActive: true, completeness: 90 },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', isRTL: false, isActive: true, completeness: 85 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, isActive: false, completeness: 75 },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false, isActive: false, completeness: 60 }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLanguage, setNewLanguage] = useState<Omit<Language, 'completeness'>>({
    code: '',
    name: '',
    nativeName: '',
    isRTL: false,
    isActive: false
  });

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const language: Language = {
      ...newLanguage,
      completeness: 0
    };
    setLanguages([...languages, language]);
    setNewLanguage({ code: '', name: '', nativeName: '', isRTL: false, isActive: false });
    setShowAddForm(false);
  };

  const toggleLanguageStatus = (code: string) => {
    setLanguages(languages.map(lang => 
      lang.code === code ? { ...lang, isActive: !lang.isActive } : lang
    ));
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return 'text-green-600 bg-green-100';
    if (completeness >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Language Management</h2>
            <p className="text-gray-600">Manage multi-language support</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Language</span>
        </button>
      </div>

      {/* Current Language Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.filter(lang => lang.isActive).map((language) => (
            <button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                currentLanguage === language.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="font-semibold">{language.nativeName}</p>
                <p className="text-sm text-gray-600">{language.name}</p>
                <div className={`mt-2 px-2 py-1 text-xs rounded-full ${getCompletenessColor(language.completeness)}`}>
                  {language.completeness}% complete
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Language Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Language</h3>
          <form onSubmit={handleAddLanguage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Language Code (e.g., en, es)"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="English Name"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Native Name"
                value={newLanguage.nativeName}
                onChange={(e) => setNewLanguage({...newLanguage, nativeName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newLanguage.isRTL}
                    onChange={(e) => setNewLanguage({...newLanguage, isRTL: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Right-to-Left</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newLanguage.isActive}
                    onChange={(e) => setNewLanguage({...newLanguage, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Language
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Language List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Languages</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {languages.map((language) => (
            <div key={language.code} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{language.nativeName}</h4>
                    <p className="text-sm text-gray-600">{language.name} ({language.code})</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {language.isRTL && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">RTL</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${getCompletenessColor(language.completeness)}`}>
                        {language.completeness}% complete
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleLanguageStatus(language.code)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      language.isActive 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {language.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;