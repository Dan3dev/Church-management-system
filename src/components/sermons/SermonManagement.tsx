import React, { useState } from 'react';
import { Play, Upload, Download, Eye, Calendar, Tag, Search } from 'lucide-react';
import { Sermon } from '../../types';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeries, setFilterSeries] = useState<string>('All');

  const [newSermon, setNewSermon] = useState<Omit<Sermon, 'id'>>({
    title: '',
    speaker: '',
    date: new Date().toISOString().split('T')[0],
    scripture: '',
    description: '',
    campus: 'Main Campus',
    views: 0,
    downloads: 0,
    tags: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSermon(newSermon);
    setNewSermon({
      title: '',
      speaker: '',
      date: new Date().toISOString().split('T')[0],
      scripture: '',
      description: '',
      campus: 'Main Campus',
      views: 0,
      downloads: 0,
      tags: []
    });
    setShowAddForm(false);
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = filterSeries === 'All' || sermon.series === filterSeries;
    return matchesSearch && matchesSeries;
  });

  const allSeries = Array.from(new Set(sermons.map(s => s.series).filter(Boolean)));

  const recentSermons = sermons
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const totalViews = sermons.reduce((sum, s) => sum + s.views, 0);
  const totalDownloads = sermons.reduce((sum, s) => sum + s.downloads, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sermon Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Add Sermon</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Play className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{sermons.length}</p>
            <p className="text-sm text-gray-500">Total Sermons</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Download className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Downloads</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Tag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{allSeries.length}</p>
            <p className="text-sm text-gray-500">Sermon Series</p>
          </div>
        </div>
      </div>

      {/* Add Sermon Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Sermon</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sermon Title"
                value={newSermon.title}
                onChange={(e) => setNewSermon({...newSermon, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Speaker"
                value={newSermon.speaker}
                onChange={(e) => setNewSermon({...newSermon, speaker: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="date"
                value={newSermon.date}
                onChange={(e) => setNewSermon({...newSermon, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Scripture Reference"
                value={newSermon.scripture}
                onChange={(e) => setNewSermon({...newSermon, scripture: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Series (optional)"
                value={newSermon.series || ''}
                onChange={(e) => setNewSermon({...newSermon, series: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newSermon.duration || ''}
                onChange={(e) => setNewSermon({...newSermon, duration: parseInt(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <textarea
              placeholder="Sermon Description"
              value={newSermon.description}
              onChange={(e) => setNewSermon({...newSermon, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="url"
                placeholder="Audio URL (optional)"
                value={newSermon.audioUrl || ''}
                onChange={(e) => setNewSermon({...newSermon, audioUrl: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Video URL (optional)"
                value={newSermon.videoUrl || ''}
                onChange={(e) => setNewSermon({...newSermon, videoUrl: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Notes URL (optional)"
                value={newSermon.notesUrl || ''}
                onChange={(e) => setNewSermon({...newSermon, notesUrl: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newSermon.tags.join(', ')}
              onChange={(e) => setNewSermon({...newSermon, tags: e.target.value.split(',').map(tag => tag.trim())})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Sermon
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
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
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          </div>
          <div className="text-sm text-gray-500">
            {filteredSermons.length} sermons found
          </div>
        </div>
      </div>

      {/* Recent Sermons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sermons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSermons.map((sermon) => (
            <div key={sermon.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2">{sermon.title}</h4>
                  {sermon.series && (
                    <p className="text-sm text-purple-600 font-medium">{sermon.series}</p>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(sermon.date).toLocaleDateString()}</span>
                  </div>
                  <p>Speaker: {sermon.speaker}</p>
                  <p>Scripture: {sermon.scripture}</p>
                  {sermon.duration && <p>Duration: {sermon.duration} minutes</p>}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{sermon.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span>{sermon.views} views</span>
                    <span>{sermon.downloads} downloads</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {sermon.audioUrl && (
                    <button className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      <Play className="h-3 w-3" />
                      <span>Audio</span>
                    </button>
                  )}
                  {sermon.videoUrl && (
                    <button className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      <Play className="h-3 w-3" />
                      <span>Video</span>
                    </button>
                  )}
                  {sermon.notesUrl && (
                    <button className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      <Download className="h-3 w-3" />
                      <span>Notes</span>
                    </button>
                  )}
                </div>

                {sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sermon.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Sermons List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Sermons</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredSermons.map((sermon) => (
            <div key={sermon.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Play className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{sermon.title}</h4>
                      {sermon.series && (
                        <p className="text-sm text-purple-600 font-medium">{sermon.series}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{sermon.speaker}</span>
                        <span>{new Date(sermon.date).toLocaleDateString()}</span>
                        <span>{sermon.scripture}</span>
                        <span>{sermon.views} views</span>
                        <span>{sermon.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {sermon.audioUrl && (
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  {sermon.videoUrl && (
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  {sermon.notesUrl && (
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SermonManagement;