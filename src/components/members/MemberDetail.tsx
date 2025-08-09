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
  AlertCircle,
  Home,
  Briefcase,
  GraduationCap,
  Star,
  Activity,
  MessageCircle,
  Camera,
  Download,
  Share2
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
  const [activeTab, setActiveTab] = useState('overview');

  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberGiving = giving.filter(g => g.memberId === member.id);
  const totalGiving = memberGiving.reduce((sum, g) => sum + g.amount, 0);
  const attendanceRate = memberAttendance.length > 0 
    ? Math.round((memberAttendance.filter(a => a.present).length / memberAttendance.length) * 100)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'giving', label: 'Giving', icon: Heart },
    { id: 'ministry', label: 'Ministry', icon: Award },
    { id: 'notes', label: 'Notes & History', icon: MessageCircle }
  ];

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

  const getEngagementScore = () => {
    let score = 0;
    
    // Attendance contribution (40%)
    score += (attendanceRate / 100) * 40;
    
    // Ministry involvement (30%)
    score += Math.min(member.ministry.length * 10, 30);
    
    // Giving consistency (20%)
    const givingMonths = new Set(memberGiving.map(g => g.date.slice(0, 7))).size;
    score += Math.min(givingMonths * 5, 20);
    
    // Recent activity (10%)
    const recentActivity = memberAttendance.filter(a => {
      const date = new Date(a.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return date >= oneMonthAgo && a.present;
    }).length;
    score += Math.min(recentActivity * 2.5, 10);
    
    return Math.round(score);
  };

  const engagementScore = getEngagementScore();

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{member.firstName} {member.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <p className="text-gray-900">{member.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-500" />
                <p className="text-gray-900">{member.phone}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-500 mt-1" />
                <p className="text-gray-900">{member.address}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <p className="text-gray-900">{calculateAge(member.dateOfBirth)} years old</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <p className="text-gray-900">
                  {new Date(member.dateOfBirth).toLocaleDateString()} 
                  <span className="text-sm text-gray-500 ml-2">
                    ({getNextBirthday(member.dateOfBirth)} days until birthday)
                  </span>
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
              <p className="text-gray-900">{member.maritalStatus || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <p className="text-gray-900">{member.occupation || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Information */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Spiritual Journey</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {member.salvationDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salvation Date</label>
                <p className="text-gray-900">{new Date(member.salvationDate).toLocaleDateString()}</p>
              </div>
            )}
            {member.waterBaptismDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Baptism</label>
                <p className="text-gray-900">{new Date(member.waterBaptismDate).toLocaleDateString()}</p>
              </div>
            )}
            {member.holyGhostBaptismDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holy Ghost Baptism</label>
                <p className="text-gray-900">{new Date(member.holyGhostBaptismDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discipleship Level</label>
              <p className="text-gray-900">{member.discipleshipLevel || 'Not assessed'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Connection Status</label>
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                member.connectionStatus === 'Connected' ? 'bg-green-100 text-green-700' :
                member.connectionStatus === 'Connecting' ? 'bg-yellow-100 text-yellow-700' :
                member.connectionStatus === 'At Risk' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {member.connectionStatus || 'Not assessed'}
              </span>
            </div>
            {member.spiritualGifts && member.spiritualGifts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spiritual Gifts</label>
                <div className="flex flex-wrap gap-1">
                  {member.spiritualGifts.map((gift, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      {gift}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Score */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-2">Engagement Score</h4>
            <p className="text-purple-100">Based on attendance, ministry, and giving patterns</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{engagementScore}</div>
            <div className="text-sm text-purple-200">out of 100</div>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${engagementScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderFamilyTab = () => (
    <div className="space-y-6">
      {family ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{family.familyName} Family</h3>
              <p className="text-gray-600">Head of Family: {family.headOfFamily}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>{family.members.length} members</span>
                <span>Joined: {new Date(family.joinDate).toLocaleDateString()}</span>
                {family.anniversary && (
                  <span>Anniversary: {new Date(family.anniversary).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Family Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{family.address}</span>
                </div>
                {family.homePhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{family.homePhone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Family Size: {family.familySize || family.members.length}</span>
                </div>
                {family.income && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Income Range: {family.income}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Family Members</h4>
              <div className="space-y-2">
                {familyMembers.map((familyMember) => (
                  <div key={familyMember.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs">
                          {familyMember.firstName.charAt(0)}{familyMember.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {familyMember.firstName} {familyMember.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {familyMember.relationshipType || 'Family Member'} • Age {calculateAge(familyMember.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      familyMember.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                      familyMember.membershipStatus === 'Visitor' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {familyMember.membershipStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {family.notes && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Family Notes</h5>
              <p className="text-yellow-700 text-sm">{family.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>This member is not part of a registered family</p>
        </div>
      )}
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{attendanceRate}%</div>
          <p className="text-gray-600">Attendance Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{memberAttendance.filter(a => a.present).length}</div>
          <p className="text-gray-600">Services Attended</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{memberAttendance.length}</div>
          <p className="text-gray-600">Total Records</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {memberAttendance
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{record.service}</p>
                <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                {record.notes && (
                  <p className="text-xs text-gray-400 mt-1">{record.notes}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  record.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.present ? 'Present' : 'Absent'}
                </span>
                {record.checkInTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(record.checkInTime).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGivingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">${totalGiving.toLocaleString()}</div>
          <p className="text-gray-600">Total Giving</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{memberGiving.length}</div>
          <p className="text-gray-600">Total Gifts</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            ${memberGiving.length > 0 ? Math.round(totalGiving / memberGiving.length).toLocaleString() : '0'}
          </div>
          <p className="text-gray-600">Average Gift</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Giving History</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {memberGiving
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((gift) => (
            <div key={gift.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{gift.type.charAt(0).toUpperCase() + gift.type.slice(1)}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{gift.fund}</span>
                  <span>{new Date(gift.date).toLocaleDateString()}</span>
                  <span>{gift.paymentMethod}</span>
                  {gift.recurring && <span className="text-blue-600">Recurring</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-green-600">${gift.amount.toLocaleString()}</span>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  {gift.taxDeductible && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Tax Deductible</span>
                  )}
                  {gift.receiptSent && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Receipt Sent</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMinistryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ministry Involvement</h4>
        {member.ministry.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.ministry.map((ministry, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">{ministry}</h5>
                    <p className="text-sm text-gray-500">Active participant</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Not currently involved in any ministries</p>
          </div>
        )}
      </div>

      {member.skills && member.skills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills & Talents</h4>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
              <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {member.servingAreas && member.servingAreas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Serving Areas</h4>
          <div className="space-y-2">
            {member.servingAreas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700">{area}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNotesTab = () => (
    <div className="space-y-6">
      {member.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Member Notes</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-700">{member.notes}</p>
          </div>
        </div>
      )}

      {member.membershipHistory && member.membershipHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Membership History</h4>
          <div className="space-y-3">
            {member.membershipHistory.map((history, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{history.status}</p>
                  <p className="text-sm text-gray-500">{new Date(history.date).toLocaleDateString()}</p>
                  {history.notes && (
                    <p className="text-xs text-gray-400 mt-1">{history.notes}</p>
                  )}
                </div>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Communication Preferences</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <span className={member.preferences.emailNotifications ? 'text-green-600' : 'text-red-600'}>
                  {member.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Notifications</span>
                <span className={member.preferences.smsNotifications ? 'text-green-600' : 'text-red-600'}>
                  {member.preferences.smsNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Newsletter</span>
                <span className={member.preferences.receiveNewsletter ? 'text-green-600' : 'text-red-600'}>
                  {member.preferences.receiveNewsletter ? 'Subscribed' : 'Unsubscribed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Photography Permission</span>
                <span className={member.preferences.allowPhotography ? 'text-green-600' : 'text-red-600'}>
                  {member.preferences.allowPhotography ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Preferred Method:</span>
                <span className="ml-2 font-medium capitalize">{member.preferences.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-gray-600">Language:</span>
                <span className="ml-2 font-medium">{member.preferences.communicationLanguage}</span>
              </div>
              {member.preferences.mailingAddress && (
                <div>
                  <span className="text-gray-600">Mailing Address:</span>
                  <p className="text-gray-900 mt-1">{member.preferences.mailingAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h4>
        <div className="space-y-3">
          {member.emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{contact.phone}</p>
                {contact.isPrimary && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Primary</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                {member.profileImage ? (
                  <img src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${
                member.membershipStatus === 'Active' ? 'bg-green-500' :
                member.membershipStatus === 'Visitor' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                  member.membershipStatus === 'Inactive' ? 'bg-red-100 text-red-700' :
                  member.membershipStatus === 'Visitor' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {member.membershipStatus}
                </span>
                <span className="capitalize">{member.role}</span>
                <span>Age: {calculateAge(member.dateOfBirth)}</span>
                <span>Member since: {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Camera className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
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
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'family' && renderFamilyTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'giving' && renderGivingTab()}
          {activeTab === 'ministry' && renderMinistryTab()}
          {activeTab === 'notes' && renderNotesTab()}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;