import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Search, Filter, Folder, File } from 'lucide-react';
import { Document } from '../../types';

interface DocumentManagerProps {
  documents: Document[];
  onAddDocument: (document: Omit<Document, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [newDocument, setNewDocument] = useState<Omit<Document, 'id'>>({
    name: '',
    category: 'Administrative',
    fileUrl: '',
    fileType: '',
    fileSize: 0,
    uploadedBy: 'Admin',
    uploadedDate: new Date().toISOString(),
    campus: 'Main Campus',
    isPublic: false,
    tags: [],
    version: 1
  });

  const categories = ['Financial', 'Legal', 'Ministry', 'Administrative', 'Reports', 'Other'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      const fileUrl = URL.createObjectURL(file);
      setNewDocument({
        ...newDocument,
        name: file.name,
        fileUrl,
        fileType: file.type,
        fileSize: file.size
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDocument(newDocument);
    setNewDocument({
      name: '',
      category: 'Administrative',
      fileUrl: '',
      fileType: '',
      fileSize: 0,
      uploadedBy: 'Admin',
      uploadedDate: new Date().toISOString(),
      campus: 'Main Campus',
      isPublic: false,
      tags: [],
      version: 1
    });
    setShowUploadForm(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📈';
    return '📄';
  };

  const documentsByCategory = categories.map(category => ({
    category,
    count: documents.filter(d => d.category === category).length,
    documents: documents.filter(d => d.category === category)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Manager</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            <p className="text-sm text-gray-500">Total Documents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {documents.filter(d => d.isPublic).length}
            </p>
            <p className="text-sm text-gray-500">Public Documents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(documents.reduce((sum, d) => sum + d.fileSize, 0) / (1024 * 1024))} MB
            </p>
            <p className="text-sm text-gray-500">Total Storage</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Document</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({...newDocument, category: e.target.value as Document['category']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={newDocument.description || ''}
              onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newDocument.tags.join(', ')}
              onChange={(e) => setNewDocument({...newDocument, tags: e.target.value.split(',').map(tag => tag.trim())})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newDocument.isPublic}
                onChange={(e) => setNewDocument({...newDocument, isPublic: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">Make document public</label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          {documentsByCategory
            .filter(cat => cat.count > 0)
            .map(({ category, documents: categoryDocs }) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category} ({categoryDocs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryDocs
                  .filter(doc => 
                    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getFileIcon(document.fileType)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
                          <p className="text-sm text-gray-500">{formatFileSize(document.fileSize)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteDocument(document.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {document.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>By {document.uploadedBy}</span>
                      <span>{new Date(document.uploadedDate).toLocaleDateString()}</span>
                    </div>

                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        document.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {document.isPublic ? 'Public' : 'Private'}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getFileIcon(document.fileType)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{document.category}</span>
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>By {document.uploadedBy}</span>
                        <span>{new Date(document.uploadedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      document.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {document.isPublic ? 'Public' : 'Private'}
                    </span>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(document.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;