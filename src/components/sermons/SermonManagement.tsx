import React, { useState } from 'react';
import { 
  Play, 
  Upload, 
  Download, 
  Eye, 
  Calendar, 
  Tag, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Share2,
  Heart,
  MessageCircle,
  Star,
  Clock,
  Users,
  BarChart3,
  Headphones,
  Video,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Sermon, SermonSeries, SermonFeedback } from '../../types';
import { useApp } from '../../context/AppContext';

interface SermonManagementProps {
  sermons: Sermon[];
  onAddSermon: (sermon: Omit<Sermon, 'id'>) => void;
  onUpdateSermon: (id: string, sermon: Partial<Sermon>) => void;
}

const SermonManagement: React.FC<SermonManagementProps> = ({
  sermons,
  onAddSermon,
  onUpdateSermon
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeries, setFilterSeries] = useState<string>('All');
  const [filterSpeaker, setFilterSpeaker] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const { t, state } = useApp();

  const [newSermon, setNewSermon] = useState<Omit<Sermon, 'id'>>({
    title: '',
    speaker: '',
    date: new Date().toISOString().split('T')[0],
    scripture: '',
    description: '',
    campus: 'Main Campus',
    views: 0,
    downloads: 0,
    likes: 0,
    shares: 0,
    tags: [],
    isPublic: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [sermonSeries] = useState<SermonSeries[]>([
    {
      id: '1',
      title: 'Faith Journey',
      description: 'A series exploring the depths of faith in daily life',
      speaker: 'Pastor John Smith',
      startDate: '2024-01-01',
      sermons: ['1', '2'],
      isActive: true,
      campus: 'Main Campus'
    },
    {
      id: '2',
      title: 'Love in Action',
      description: 'Practical ways to show God\'s love to others',
      speaker: 'Pastor Sarah Johnson',
      startDate: '2024-02-01',
      sermons: [],
      isActive: true,
      campus: 'Main Campus'
    }
  ]);

  const speakers = Array.from(new Set(sermons.map(s => s.speaker)));
  const allSeries = Array.from(new Set(sermons.map(s => s.series).filter(Boolean)));
  const allTags = Array.from(new Set(sermons.flatMap(s => s.tags)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sermonData = {
      ...newSermon,
      createdAt: editingSermon ? editingSermon.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingSermon) {
      onUpdateSermon(editingSermon.id, sermonData);
      setEditingSermon(null);
      
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: 'admin',
          type: 'success',
          title: 'Sermon Updated',
          message: `${newSermon.title} has been updated`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'sermons'
        }
      });
    } else {
      onAddSermon(sermonData);
      
      state.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          userId: 'admin',
          type: 'success',
          title: 'Sermon Added',
          message: `${newSermon.title} has been added to the library`,
          read: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          category: 'sermons'
        }
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewSermon({
      title: '',
      speaker: '',
      date: new Date().toISOString().split('T')[0],
      scripture: '',
      description: '',
      campus: 'Main Campus',
      views: 0,
      downloads: 0,
      likes: 0,
      shares: 0,
      tags: [],
      isPublic: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setShowAddForm(false);
  };

  const startEdit = (sermon: Sermon) => {
    setNewSermon(sermon);
    setEditingSermon(sermon);
    setShowAddForm(true);
  };

  const toggleFeatured = (sermon: Sermon) => {
    onUpdateSermon(sermon.id, { 
      featured: !sermon.featured,
      updatedAt: new Date().toISOString()
    });
    
    state.dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        userId: 'admin',
        type: 'info',
        title: sermon.featured ? 'Sermon Unfeatured' : 'Sermon Featured',
        message: `${sermon.title} ${sermon.featured ? 'removed from' : 'added to'} featured sermons`,
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'low',
        category: 'sermons'
      }
    });
  };

  const incrementViews = (sermon: Sermon) => {
    onUpdateSermon(sermon.id, { 
      views: sermon.views + 1,
      updatedAt: new Date().toISOString()
    });
  };

  const incrementDownloads = (sermon: Sermon) => {
    onUpdateSermon(sermon.id, { 
      downloads: sermon.downloads + 1,
      updatedAt: new Date().toISOString()
    });
  };

  const toggleLike = (sermon: Sermon) => {
    onUpdateSermon(sermon.id, { 
      likes: sermon.likes + 1,
      updatedAt: new Date().toISOString()
    });
  };

  const shareSermon = (sermon: Sermon) => {
    onUpdateSermon(sermon.id, { 
      shares: sermon.shares + 1,
      updatedAt: new Date().toISOString()
    });
    
    // Simulate sharing
    if (navigator.share) {
      navigator.share({
        title: sermon.title,
        text: sermon.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${sermon.title} - ${window.location.href}`);
      alert('Sermon link copied to clipboard!');
    }
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeries = filterSeries === 'All' || sermon.series === filterSeries;
    const matchesSpeaker = filterSpeaker === 'All' || sermon.speaker === filterSpeaker;
    return matchesSearch && matchesSeries && matchesSpeaker;
  });

  const recentSermons = sermons
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const featuredSermons = sermons.filter(s => s.featured);
  const popularSermons = sermons
    .sort((a, b) => (b.views + b.downloads + b.likes) - (a.views + a.downloads + a.likes))
    .slice(0, 5);

  const sermonStats = {
    total: sermons.length,
    totalViews: sermons.reduce((sum, s) => sum + s.views, 0),
    totalDownloads: sermons.reduce((sum, s) => sum + s.downloads, 0),
    totalLikes: sermons.reduce((sum, s) => sum + s.likes, 0),
    avgDuration: sermons.filter(s => s.duration).length > 0 ? 
      Math.round(sermons.filter(s => s.duration).reduce((sum, s) => sum + (s.duration || 0), 0) / sermons.filter(s => s.duration).length) : 0,
    seriesCount: allSeries.length,
    speakerCount: speakers.length
  };

  const renderSermonCard = (sermon: Sermon) => (
    <div key={sermon.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
              {sermon.title}
            </h4>
            {sermon.featured && (
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            )}
          </div>
          {sermon.series && (
            <p className="text-sm text-purple-600 font-medium mb-2">{sermon.series}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(sermon.date).toLocaleDateString()}</span>
            </div>
            <span>by {sermon.speaker}</span>
            {sermon.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{sermon.duration} min</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Scripture:</strong> {sermon.scripture}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{sermon.description}</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startEdit(sermon);
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFeatured(sermon);
            }}
            className={`p-2 rounded-lg transition-colors ${
              sermon.featured 
                ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            <Star className={`h-4 w-4 ${sermon.featured ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Links */}
      <div className="flex space-x-2 mb-4">
        {sermon.audioUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              incrementViews(sermon);
              window.open(sermon.audioUrl, '_blank');
            }}
            className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Headphones className="h-3 w-3" />
            <span>Audio</span>
          </button>
        )}
        {sermon.videoUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              incrementViews(sermon);
              window.open(sermon.videoUrl, '_blank');
            }}
            className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Video className="h-3 w-3" />
            <span>Video</span>
          </button>
        )}
        {sermon.notesUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              incrementDownloads(sermon);
              window.open(sermon.notesUrl, '_blank');
            }}
            className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <FileText className="h-3 w-3" />
            <span>Notes</span>
          </button>
        )}
        {sermon.slidesUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              incrementDownloads(sermon);
              window.open(sermon.slidesUrl, '_blank');
            }}
            className="flex items-center space-x-1 text-xs bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Slides</span>
          </button>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{sermon.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-3 w-3" />
            <span>{sermon.downloads}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>{sermon.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="h-3 w-3" />
            <span>{sermon.shares}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full ${
          sermon.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {sermon.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      {/* Tags */}
      {sermon.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {sermon.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {sermon.tags.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              +{sermon.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(sermon);
          }}
          className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span>Like</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            shareSermon(sermon);
          }}
          className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSermon(sermon);
          }}
          className="flex-1 flex items-center justify-center space-x-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('sermons')} Library</h2>
          <p className="text-gray-600">Manage and share sermon content</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Add Sermon</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Sermons</p>
              <p className="text-3xl font-bold">{sermonStats.total}</p>
            </div>
            <Play className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Views</p>
              <p className="text-3xl font-bold">{sermonStats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Downloads</p>
              <p className="text-3xl font-bold">{sermonStats.totalDownloads.toLocaleString()}</p>
            </div>
            <Download className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Likes</p>
              <p className="text-3xl font-bold">{sermonStats.totalLikes.toLocaleString()}</p>
            </div>
            <Heart className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg Duration</p>
              <p className="text-3xl font-bold">{sermonStats.avgDuration}m</p>
            </div>
            <Clock className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Series</p>
              <p className="text-3xl font-bold">{sermonStats.seriesCount}</p>
            </div>
            <Tag className="h-8 w-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100">Speakers</p>
              <p className="text-3xl font-bold">{sermonStats.speakerCount}</p>
            </div>
            <Users className="h-8 w-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Featured Sermons */}
      {featuredSermons.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Sermons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSermons.map(sermon => renderSermonCard(sermon))}
          </div>
        </div>
      )}

      {/* Add Sermon Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Sermon Title"
                  value={newSermon.title}
                  onChange={(e) => setNewSermon({...newSermon, title: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Speaker"
                  value={newSermon.speaker}
                  onChange={(e) => setNewSermon({...newSermon, speaker: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  value={newSermon.date}
                  onChange={(e) => setNewSermon({...newSermon, date: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Scripture Reference"
                  value={newSermon.scripture}
                  onChange={(e) => setNewSermon({...newSermon, scripture: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Series (optional)"
                  value={newSermon.series || ''}
                  onChange={(e) => setNewSermon({...newSermon, series: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newSermon.duration || ''}
                  onChange={(e) => setNewSermon({...newSermon, duration: parseInt(e.target.value)})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Description & Content</h4>
              <textarea
                placeholder="Sermon Description"
                value={newSermon.description}
                onChange={(e) => setNewSermon({...newSermon, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            {/* Media URLs */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Media & Resources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="Audio URL (optional)"
                  value={newSermon.audioUrl || ''}
                  onChange={(e) => setNewSermon({...newSermon, audioUrl: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Video URL (optional)"
                  value={newSermon.videoUrl || ''}
                  onChange={(e) => setNewSermon({...newSermon, videoUrl: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Notes URL (optional)"
                  value={newSermon.notesUrl || ''}
                  onChange={(e) => setNewSermon({...newSermon, notesUrl: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="Slides URL (optional)"
                  value={newSermon.slidesUrl || ''}
                  onChange={(e) => setNewSermon({...newSermon, slidesUrl: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tags and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newSermon.tags.join(', ')}
                  onChange={(e) => setNewSermon({...newSermon, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newSermon.isPublic}
                    onChange={(e) => setNewSermon({...newSermon, isPublic: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Make sermon public</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={newSermon.featured}
                    onChange={(e) => setNewSermon({...newSermon, featured: e.target.checked})}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Feature this sermon</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingSermon ? 'Update Sermon' : 'Add Sermon'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search sermons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterSeries}
            onChange={(e) => setFilterSeries(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Series</option>
            {allSeries.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>

          <select
            value={filterSpeaker}
            onChange={(e) => setFilterSpeaker(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Speakers</option>
            {speakers.map(speaker => (
              <option key={speaker} value={speaker}>{speaker}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredSermons.length} sermons found
          </div>
        </div>
      </div>

      {/* Popular Sermons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular</h3>
        <div className="space-y-3">
          {popularSermons.map((sermon, index) => (
            <div key={sermon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => setSelectedSermon(sermon)}>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{sermon.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{sermon.speaker}</span>
                    <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    <span>{sermon.scripture}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{sermon.views}</p>
                  <p className="text-xs">views</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{sermon.downloads}</p>
                  <p className="text-xs">downloads</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-red-600">{sermon.likes}</p>
                  <p className="text-xs">likes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Sermons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Sermons</h3>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map(sermon => renderSermonCard(sermon))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedSermon(sermon)}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Play className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{sermon.title}</h4>
                      {sermon.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    {sermon.series && (
                      <p className="text-sm text-purple-600 font-medium">{sermon.series}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{sermon.speaker}</span>
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                      <span>{sermon.scripture}</span>
                      <span>{sermon.views} views</span>
                      <span>{sermon.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {sermon.audioUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementViews(sermon);
                        window.open(sermon.audioUrl, '_blank');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Headphones className="h-4 w-4" />
                    </button>
                  )}
                  {sermon.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementViews(sermon);
                        window.open(sermon.videoUrl, '_blank');
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                  )}
                  {sermon.notesUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementDownloads(sermon);
                        window.open(sermon.notesUrl, '_blank');
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(sermon);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sermon Detail Modal */}
      {selectedSermon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedSermon.title}</h3>
                <p className="text-gray-600">{selectedSermon.speaker} • {new Date(selectedSermon.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedSermon(null)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Scripture</h4>
                  <p className="text-gray-700">{selectedSermon.scripture}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Series</h4>
                  <p className="text-gray-700">{selectedSermon.series || 'Standalone'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedSermon.description}</p>
              </div>

              {/* Media Player Simulation */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSermon.audioUrl && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Headphones className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Audio</span>
                      </div>
                      <button
                        onClick={() => {
                          incrementViews(selectedSermon);
                          window.open(selectedSermon.audioUrl, '_blank');
                        }}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Play Audio
                      </button>
                    </div>
                  )}
                  
                  {selectedSermon.videoUrl && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Video className="h-6 w-6 text-green-600" />
                        <span className="font-medium">Video</span>
                      </div>
                      <button
                        onClick={() => {
                          incrementViews(selectedSermon);
                          window.open(selectedSermon.videoUrl, '_blank');
                        }}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Watch Video
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedSermon.views}</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedSermon.downloads}</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{selectedSermon.likes}</p>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedSermon.shares}</p>
                  <p className="text-sm text-gray-600">Shares</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleLike(selectedSermon)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => shareSermon(selectedSermon)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedSermon(null);
                    startEdit(selectedSermon);
                  }}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonManagement;