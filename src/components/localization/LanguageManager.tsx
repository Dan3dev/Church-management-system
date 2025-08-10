import React, { useState } from 'react';
import { Globe, Plus, Edit, Trash2, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react';
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
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [newLanguage, setNewLanguage] = useState<Omit<Language, 'completeness'>>({
    code: '',
    name: '',
    nativeName: '',
    isRTL: false,
    isActive: false
  });

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (languages.find(l => l.code === newLanguage.code)) {
      alert('Language code already exists!');
      return;
    }
    
    const language: Language = {
      ...newLanguage,
      completeness: 0
    };
    
    if (editingLanguage) {
      setLanguages(languages.map(l => 
        l.code === editingLanguage.code ? { ...language, completeness: editingLanguage.completeness } : l
      ));
      setEditingLanguage(null);
      alert('Language updated successfully!');
    } else {
      setLanguages([...languages, language]);
      alert('Language added successfully!');
    }
    
    setNewLanguage({ code: '', name: '', nativeName: '', isRTL: false, isActive: false });
    setShowAddForm(false);
  };

  const startEdit = (language: Language) => {
    setNewLanguage(language);
    setEditingLanguage(language);
    setShowAddForm(true);
  };

  const toggleLanguageStatus = (code: string) => {
    setLanguages(languages.map(lang => {
      if (lang.code === code) {
        const newStatus = !lang.isActive;
        if (newStatus) {
          alert(`${lang.name} language activated!`);
        } else {
          alert(`${lang.name} language deactivated!`);
        }
        return { ...lang, isActive: newStatus };
      }
      return lang;
    }));
  };

  const deleteLanguage = (code: string) => {
    const language = languages.find(l => l.code === code);
    if (code === 'en') {
      alert('Cannot delete English language!');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${language?.name}?`)) {
      setLanguages(languages.filter(l => l.code !== code));
      alert('Language deleted successfully!');
    }
  };

  const changeLanguage = (code: string) => {
    const language = languages.find(l => l.code === code);
    if (language?.isActive) {
      onLanguageChange(code);
      alert(`Language changed to ${language.name}`);
      
      // Simulate applying language changes to the UI
      document.documentElement.lang = code;
      if (language.isRTL) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } else {
      alert('Please activate this language first!');
    }
  };

  const exportTranslations = (languageCode: string) => {
    const language = languages.find(l => l.code === languageCode);
    if (!language) return;
    
    // Simulate translation export
    const translations = {
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'members.title': 'Members',
      'finance.title': 'Finance',
      'events.title': 'Events'
    };
    
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations_${languageCode}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTranslations = (languageCode: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const translations = JSON.parse(e.target?.result as string);
            const translationCount = Object.keys(translations).length;
            const completeness = Math.min((translationCount / 100) * 100, 100);
            
            setLanguages(languages.map(l => 
              l.code === languageCode 
                ? { ...l, completeness }
                : l
            ));
            
            alert(`Translations imported! Completeness: ${completeness.toFixed(1)}%`);
          } catch (error) {
            alert('Invalid translation file!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
            <p className="text-gray-600">Manage multi-language support and translations</p>
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
              onClick={() => changeLanguage(language.code)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                currentLanguage === language.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="font-semibold text-lg">{language.nativeName}</p>
                <p className="text-sm text-gray-600">{language.name}</p>
                <div className={`mt-2 px-2 py-1 text-xs rounded-full ${getCompletenessColor(language.completeness)}`}>
                  {language.completeness}% complete
                </div>
                {currentLanguage === language.code && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 inline-block">
                    Current
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Language Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingLanguage ? 'Edit Language' : 'Add New Language'}
          </h3>
          <form onSubmit={handleAddLanguage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Language Code (e.g., en, es)"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value.toLowerCase()})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={2}
                disabled={!!editingLanguage}
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
                {editingLanguage ? 'Update Language' : 'Add Language'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingLanguage(null);
                  setNewLanguage({ code: '', name: '', nativeName: '', isRTL: false, isActive: false });
                }}
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
            <div key={language.code} className="px-6 py-4 hover:bg-gray-50 transition-colors">
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
                      {currentLanguage === language.code && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Current</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportTranslations(language.code)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Export Translations"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => importTranslations(language.code)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Import Translations"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
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
                  <button 
                    onClick={() => startEdit(language)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {language.code !== 'en' && (
                    <button 
                      onClick={() => deleteLanguage(language.code)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Translation Progress</h3>
        <div className="space-y-4">
          {languages.filter(l => l.isActive).map((language) => (
            <div key={language.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{language.nativeName}</span>
                <span className="text-sm text-gray-600">{language.completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    language.completeness >= 90 ? 'bg-green-500' :
                    language.completeness >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${language.completeness}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageManager;