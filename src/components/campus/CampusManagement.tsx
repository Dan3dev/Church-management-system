import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Campus } from '../../types';

interface CampusManagementProps {
  campuses: Campus[];
  onAddCampus: (campus: Omit<Campus, 'id'>) => void;
  onUpdateCampus: (id: string, campus: Partial<Campus>) => void;
  onDeleteCampus: (id: string) => void;
}

const CampusManagement: React.FC<CampusManagementProps> = ({
  campuses,
  onAddCampus,
  onUpdateCampus,
  onDeleteCampus
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);

  const [newCampus, setNewCampus] = useState<Omit<Campus, 'id'>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    pastor: '',
    capacity: 0,
    services: [],
    facilities: [],
    isActive: true
  });

  const [newService, setNewService] = useState({ name: '', time: '', day: 'Sunday' });
  const [newFacility, setNewFacility] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampus) {
      onUpdateCampus(editingCampus.id, newCampus);
      setEditingCampus(null);
    } else {
      onAddCampus(newCampus);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewCampus({
      name: '',
      address: '',
      phone: '',
      email: '',
      pastor: '',
      capacity: 0,
      services: [],
      facilities: [],
      isActive: true
    });
    setShowAddForm(false);
  };

  const startEdit = (campus: Campus) => {
    setNewCampus(campus);
    setEditingCampus(campus);
    setShowAddForm(true);
  };

  const addService = () => {
    if (newService.name && newService.time) {
      setNewCampus({
        ...newCampus,
        services: [...newCampus.services, newService]
      });
      setNewService({ name: '', time: '', day: 'Sunday' });
    }
  };

  const removeService = (index: number) => {
    setNewCampus({
      ...newCampus,
      services: newCampus.services.filter((_, i) => i !== index)
    });
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setNewCampus({
        ...newCampus,
        facilities: [...newCampus.facilities, newFacility.trim()]
      });
      setNewFacility('');
    }
  };

  const removeFacility = (index: number) => {
    setNewCampus({
      ...newCampus,
      facilities: newCampus.facilities.filter((_, i) => i !== index)
    });
  };

  const activeCampuses = campuses.filter(c => c.isActive);
  const totalCapacity = campuses.reduce((sum, c) => sum + c.capacity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campus Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Campus</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeCampuses.length}</p>
            <p className="text-sm text-gray-500">Active Campuses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Capacity</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {campuses.reduce((sum, c) => sum + c.services.length, 0)}
            </p>
            <p className="text-sm text-gray-500">Total Services</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCampus ? 'Edit Campus' : 'Add New Campus'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Campus Name"
                value={newCampus.name}
                onChange={(e) => setNewCampus({...newCampus, name: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Pastor/Campus Leader"
                value={newCampus.pastor}
                onChange={(e) => setNewCampus({...newCampus, pastor: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newCampus.phone}
                onChange={(e) => setNewCampus({...newCampus, phone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newCampus.email}
                onChange={(e) => setNewCampus({...newCampus, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newCampus.capacity}
                onChange={(e) => setNewCampus({...newCampus, capacity: parseInt(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <textarea
              placeholder="Campus Address"
              value={newCampus.address}
              onChange={(e) => setNewCampus({...newCampus, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              required
            />

            {/* Services */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Services</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newService.day}
                    onChange={(e) => setNewService({...newService, day: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                  <input
                    type="time"
                    value={newService.time}
                    onChange={(e) => setNewService({...newService, time: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {newCampus.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{service.name} - {service.day}s at {service.time}</span>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Facilities</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Facility Name"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newCampus.facilities.map((facility, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <span>{facility}</span>
                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCampus ? 'Update Campus' : 'Add Campus'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campus List */}
      <div className="grid gap-6">
        {campuses.map((campus) => (
          <div key={campus.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{campus.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      campus.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {campus.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{campus.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{campus.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{campus.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Pastor: {campus.pastor}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>Capacity: {campus.capacity.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                      <div className="space-y-1">
                        {campus.services.map((service, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {service.name} - {service.day}s at {service.time}
                          </div>
                        ))}
                      </div>
                    </div>

                    {campus.facilities.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {campus.facilities.map((facility, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(campus)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteCampus(campus.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campuses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500 mb-2">No campuses configured</p>
          <p className="text-sm text-gray-400">Add your first campus to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CampusManagement;