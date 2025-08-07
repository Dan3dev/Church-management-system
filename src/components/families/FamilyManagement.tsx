import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Home, Calendar, Heart } from 'lucide-react';
import { Family, Member } from '../../types';

interface FamilyManagementProps {
  families: Family[];
  members: Member[];
  onAddFamily: (family: Omit<Family, 'id'>) => void;
  onUpdateFamily: (id: string, family: Partial<Family>) => void;
  onDeleteFamily: (id: string) => void;
}

const FamilyManagement: React.FC<FamilyManagementProps> = ({
  families,
  members,
  onAddFamily,
  onUpdateFamily,
  onDeleteFamily
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [newFamily, setNewFamily] = useState<Omit<Family, 'id'>>({
    familyName: '',
    headOfFamily: '',
    headOfFamilyId: '',
    members: [],
    address: '',
    campus: 'Main Campus',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const headMember = members.find(m => m.id === newFamily.headOfFamilyId);
    if (headMember) {
      const familyData = {
        ...newFamily,
        headOfFamily: `${headMember.firstName} ${headMember.lastName}`
      };
      
      if (editingFamily) {
        onUpdateFamily(editingFamily.id, familyData);
        setEditingFamily(null);
      } else {
        onAddFamily(familyData);
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setNewFamily({
      familyName: '',
      headOfFamily: '',
      headOfFamilyId: '',
      members: [],
      address: '',
      campus: 'Main Campus',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const startEdit = (family: Family) => {
    setNewFamily(family);
    setEditingFamily(family);
    setShowAddForm(true);
  };

  const totalFamilyMembers = families.reduce((sum, f) => sum + f.members.length, 0);
  const averageFamilySize = families.length > 0 ? Math.round(totalFamilyMembers / families.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Family Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Family</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{families.length}</p>
            <p className="text-sm text-gray-500">Total Families</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{totalFamilyMembers}</p>
            <p className="text-sm text-gray-500">Family Members</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{averageFamilySize}</p>
            <p className="text-sm text-gray-500">Average Family Size</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {families.filter(f => f.anniversary).length}
            </p>
            <p className="text-sm text-gray-500">With Anniversaries</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingFamily ? 'Edit Family' : 'Add New Family'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Family Name"
                value={newFamily.familyName}
                onChange={(e) => setNewFamily({...newFamily, familyName: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <select
                value={newFamily.headOfFamilyId}
                onChange={(e) => setNewFamily({...newFamily, headOfFamilyId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Head of Family</option>
                {members.filter(m => m.membershipStatus === 'Active').map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newFamily.joinDate}
                onChange={(e) => setNewFamily({...newFamily, joinDate: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="date"
                placeholder="Anniversary (optional)"
                value={newFamily.anniversary || ''}
                onChange={(e) => setNewFamily({...newFamily, anniversary: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="tel"
                placeholder="Home Phone (optional)"
                value={newFamily.homePhone || ''}
                onChange={(e) => setNewFamily({...newFamily, homePhone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={newFamily.campus}
                onChange={(e) => setNewFamily({...newFamily, campus: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Main Campus">Main Campus</option>
              </select>
            </div>

            <textarea
              placeholder="Family Address"
              value={newFamily.address}
              onChange={(e) => setNewFamily({...newFamily, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Members</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {members.filter(m => m.membershipStatus === 'Active').map(member => (
                  <label key={member.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newFamily.members.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewFamily({
                            ...newFamily,
                            members: [...newFamily.members, member.id]
                          });
                        } else {
                          setNewFamily({
                            ...newFamily,
                            members: newFamily.members.filter(id => id !== member.id)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {member.firstName} {member.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Family Notes (optional)"
              value={newFamily.notes || ''}
              onChange={(e) => setNewFamily({...newFamily, notes: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingFamily ? 'Update Family' : 'Add Family'}
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

      {/* Families List */}
      <div className="grid gap-6">
        {families.map((family) => (
          <div key={family.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{family.familyName} Family</h3>
                    <p className="text-gray-600">Head: {family.headOfFamily}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Home className="h-4 w-4" />
                      <span>{family.address}</span>
                    </div>
                    {family.homePhone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📞</span>
                        <span>{family.homePhone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(family.joinDate).toLocaleDateString()}</span>
                    </div>
                    {family.anniversary && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Heart className="h-4 w-4" />
                        <span>Anniversary: {new Date(family.anniversary).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Family Members ({family.members.length})</h4>
                    <div className="space-y-1">
                      {family.members.map((memberId) => {
                        const member = members.find(m => m.id === memberId);
                        return member ? (
                          <div key={memberId} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {member.firstName} {member.lastName}
                            </span>
                            <span className="text-gray-500">
                              {member.id === family.headOfFamilyId ? 'Head' : 'Member'}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                {family.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{family.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(family)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteFamily(family.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {families.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500 mb-2">No families registered</p>
          <p className="text-sm text-gray-400">Add your first family to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;