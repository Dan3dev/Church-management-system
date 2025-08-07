import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Edit, 
  Save, 
  X,
  UserCheck,
  DollarSign,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Member, Family, AttendanceRecord, Giving } from '../../types';

interface MemberDetailProps {
  member: Member;
  family?: Family;
  familyMembers: Member[];
  attendance: AttendanceRecord[];
  giving: Giving[];
  onUpdateMember: (id: string, member: Partial<Member>) => void;
  onClose: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({
  member,
  family,
  familyMembers,
  attendance,
  giving,
  onUpdateMember,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState<Member>(member);

  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberGiving = giving.filter(g => g.memberId === member.id);
  const totalGiving = memberGiving.reduce((sum, g) => sum + g.amount, 0);
  const attendanceRate = memberAttendance.length > 0 
    ? Math.round((memberAttendance.filter(a => a.present).length / memberAttendance.length) * 100)
    : 0;

  const handleSave = () => {
    onUpdateMember(member.id, editedMember);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMember(member);
    setIsEditing(false);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getNextBirthday = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const thisYear = today.getFullYear();
    let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {member.profileImage ? (
                <img src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  member.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                  member.membershipStatus === 'Inactive' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.membershipStatus}
                </span>
                <span>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                <span>Age: {calculateAge(member.dateOfBirth)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Attendance</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{attendanceRate}%</p>
              <p className="text-xs text-blue-600">{memberAttendance.filter(a => a.present).length} of {memberAttendance.length} services</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Total Giving</span>
              </div>
              <p className="text-2xl font-bold text-green-700">${totalGiving.toLocaleString()}</p>
              <p className="text-xs text-green-600">{memberGiving.length} contributions</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Ministries</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{member.ministry.length}</p>
              <p className="text-xs text-purple-600">Active involvement</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Birthday</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">{getNextBirthday(member.dateOfBirth)}</p>
              <p className="text-xs text-orange-600">days until birthday</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedMember.firstName}
                        onChange={(e) => setEditedMember({...editedMember, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{member.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedMember.lastName}
                        onChange={(e) => setEditedMember({...editedMember, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{member.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedMember.email}
                        onChange={(e) => setEditedMember({...editedMember, email: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{member.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedMember.phone}
                        onChange={(e) => setEditedMember({...editedMember, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{member.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    {isEditing ? (
                      <textarea
                        value={editedMember.address}
                        onChange={(e) => setEditedMember({...editedMember, address: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-900">{member.address}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedMember.dateOfBirth}
                        onChange={(e) => setEditedMember({...editedMember, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                    <p className="text-gray-900">{new Date(member.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {member.occupation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedMember.occupation || ''}
                        onChange={(e) => setEditedMember({...editedMember, occupation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{member.occupation}</p>
                    )}
                  </div>
                )}

                {member.maritalStatus && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    {isEditing ? (
                      <select
                        value={editedMember.maritalStatus || ''}
                        onChange={(e) => setEditedMember({...editedMember, maritalStatus: e.target.value as Member['maritalStatus']})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{member.maritalStatus}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Emergency Contacts */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-gray-900">{member.emergencyContact.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{member.emergencyContact.phone}</p>
                  <p className="text-sm text-gray-600">{member.emergencyContact.relationship}</p>
                </div>
              </div>
            </div>

            {/* Church Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Church Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <p className="text-gray-900">{member.campus}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministries</label>
                  <div className="flex flex-wrap gap-2">
                    {member.ministry.map((ministry, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                        {ministry}
                      </span>
                    ))}
                  </div>
                </div>

                {member.smallGroup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Small Group</label>
                    <p className="text-gray-900">{member.smallGroup}</p>
                  </div>
                )}

                {member.baptismDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baptism Date</label>
                    <p className="text-gray-900">{new Date(member.baptismDate).toLocaleDateString()}</p>
                  </div>
                )}

                {member.salvationDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salvation Date</label>
                    <p className="text-gray-900">{new Date(member.salvationDate).toLocaleDateString()}</p>
                  </div>
                )}

                {member.skills && member.skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Family Information */}
              {family && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Family Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">{family.familyName} Family</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Head of Family: {family.headOfFamily}</p>
                      <p className="text-sm text-gray-600">Members: {family.members.length}</p>
                      {family.anniversary && (
                        <p className="text-sm text-gray-600">Anniversary: {new Date(family.anniversary).toLocaleDateString()}</p>
                      )}
                    </div>
                    
                    {familyMembers.length > 1 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Family Members</h5>
                        <div className="space-y-2">
                          {familyMembers.filter(fm => fm.id !== member.id).map((familyMember) => (
                            <div key={familyMember.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">
                                {familyMember.firstName} {familyMember.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {familyMember.relationshipType || 'Family Member'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Attendance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
              <div className="space-y-2">
                {memberAttendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{record.service}</p>
                      <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Giving */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Giving</h3>
              <div className="space-y-2">
                {memberGiving
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((gift) => (
                  <div key={gift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{gift.type.charAt(0).toUpperCase() + gift.type.slice(1)}</p>
                      <p className="text-sm text-gray-500">{new Date(gift.date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-semibold text-green-600">${gift.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {member.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">{member.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;