import React, { useState } from 'react';
import { Calendar, Users, Plus, Check, X } from 'lucide-react';
import { AttendanceRecord, Member } from '../types';

interface AttendanceProps {
  members: Member[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ members, attendance, onAddAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedService, setSelectedService] = useState('Sunday Morning');
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [tempAttendance, setTempAttendance] = useState<{[key: string]: boolean}>({});

  const services = [
    'Sunday Morning',
    'Sunday Evening', 
    'Wednesday Prayer',
    'Youth Service',
    'Special Event'
  ];

  // Get attendance for selected date and service
  const existingAttendance = attendance.filter(
    a => a.date === selectedDate && a.service === selectedService
  );

  const getAttendanceForDate = (date: string) => {
    return attendance.filter(a => a.date === date);
  };

  const getAttendanceStats = () => {
    const last4Weeks = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      last4Weeks.push(date.toISOString().split('T')[0]);
    }

    return last4Weeks.map(date => {
      const dayAttendance = getAttendanceForDate(date);
      const present = dayAttendance.filter(a => a.present).length;
      const total = dayAttendance.length;
      return {
        date,
        present,
        total,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    }).reverse();
  };

  const handleStartRecording = () => {
    setShowRecordForm(true);
    // Initialize temp attendance with existing records
    const temp: {[key: string]: boolean} = {};
    existingAttendance.forEach(record => {
      temp[record.memberId] = record.present;
    });
    setTempAttendance(temp);
  };

  const handleSaveAttendance = () => {
    // Create records for all members
    members.forEach(member => {
      const existing = existingAttendance.find(a => a.memberId === member.id);
      if (!existing) {
        onAddAttendance({
          memberId: member.id,
          memberName: `${member.firstName} ${member.lastName}`,
          date: selectedDate,
          service: selectedService,
          present: tempAttendance[member.id] || false
        });
      }
    });
    setShowRecordForm(false);
    setTempAttendance({});
  };

  const toggleAttendance = (memberId: string) => {
    setTempAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const attendanceStats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
        <button
          onClick={handleStartRecording}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Record Attendance</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {attendanceStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{new Date(stat.date).toLocaleDateString()}</span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.percentage}%</p>
              <p className="text-sm text-gray-600">{stat.present}/{stat.total} Present</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date and Service Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Recording Form */}
      {showRecordForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Record Attendance - {selectedService} on {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveAttendance}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Attendance
              </button>
              <button
                onClick={() => setShowRecordForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {members.filter(m => m.membershipStatus === 'Active').map((member) => {
              const isPresent = tempAttendance[member.id];
              return (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAttendance(member.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isPresent
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isPresent ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Present</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Absent</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing Attendance Records */}
      {existingAttendance.length > 0 && !showRecordForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance for {selectedService} on {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="grid gap-3">
            {existingAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">{record.memberName}</span>
                <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  record.present 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {record.present ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Present</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3" />
                      <span>Absent</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attendance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance Summary</h3>
        <div className="space-y-3">
          {attendance
            .reduce((acc: any[], record) => {
              const key = `${record.date}-${record.service}`;
              const existing = acc.find(item => item.key === key);
              if (existing) {
                existing.present += record.present ? 1 : 0;
                existing.total += 1;
              } else {
                acc.push({
                  key,
                  date: record.date,
                  service: record.service,
                  present: record.present ? 1 : 0,
                  total: 1
                });
              }
              return acc;
            }, [])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((summary, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{summary.service}</p>
                  <p className="text-sm text-gray-500">{new Date(summary.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {Math.round((summary.present / summary.total) * 100)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {summary.present}/{summary.total} Present
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Attendance;