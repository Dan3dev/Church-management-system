import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, Calendar, Receipt, Filter, Download } from 'lucide-react';
import { Giving, Member } from '../../types';

interface GivingManagementProps {
  giving: Giving[];
  members: Member[];
  onAddGiving: (giving: Omit<Giving, 'id'>) => void;
}

const GivingManagement: React.FC<GivingManagementProps> = ({ giving, members, onAddGiving }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterPeriod, setFilterPeriod] = useState<string>('');

  const [newGiving, setNewGiving] = useState<Omit<Giving, 'id'>>({
    memberId: '',
    memberName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'tithe',
    fund: 'General Fund',
    paymentMethod: 'Cash',
    campus: 'Main Campus',
    recurring: false,
    taxDeductible: true,
    receiptSent: false
  });

  const givingTypes = ['tithe', 'offering', 'special', 'missions', 'building'];
  const funds = ['General Fund', 'Building Fund', 'Missions Fund', 'Youth Fund', 'Benevolence Fund'];
  const paymentMethods = ['Cash', 'Check', 'Card', 'Bank Transfer', 'Online'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMember = members.find(m => m.id === newGiving.memberId);
    if (selectedMember) {
      onAddGiving({
        ...newGiving,
        memberName: `${selectedMember.firstName} ${selectedMember.lastName}`
      });
      setNewGiving({
        memberId: '',
        memberName: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'tithe',
        fund: 'General Fund',
        paymentMethod: 'Cash',
        campus: 'Main Campus',
        recurring: false,
        taxDeductible: true,
        receiptSent: false
      });
      setShowAddForm(false);
    }
  };

  const filteredGiving = giving.filter(g => {
    const matchesType = filterType === 'All' || g.type === filterType;
    const matchesPeriod = !filterPeriod || g.date.startsWith(filterPeriod);
    return matchesType && matchesPeriod;
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTithes = giving.filter(g => g.type === 'tithe' && g.date.startsWith(currentMonth))
    .reduce((sum, g) => sum + g.amount, 0);
  const monthlyOfferings = giving.filter(g => g.type === 'offering' && g.date.startsWith(currentMonth))
    .reduce((sum, g) => sum + g.amount, 0);
  const monthlyTotal = giving.filter(g => g.date.startsWith(currentMonth))
    .reduce((sum, g) => sum + g.amount, 0);

  const topGivers = members.map(member => {
    const memberGiving = giving.filter(g => g.memberId === member.id);
    const total = memberGiving.reduce((sum, g) => sum + g.amount, 0);
    return { ...member, totalGiving: total };
  }).sort((a, b) => b.totalGiving - a.totalGiving).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Giving Management</h2>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Statements</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Record Giving</span>
          </button>
        </div>
      </div>

      {/* Giving Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">This Month</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${monthlyTithes.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Tithes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">This Month</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${monthlyOfferings.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Offerings</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">This Month</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">${monthlyTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Giving</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Receipt className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">Average</span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ${giving.length > 0 ? Math.round(giving.reduce((sum, g) => sum + g.amount, 0) / giving.length).toLocaleString() : '0'}
            </p>
            <p className="text-sm text-gray-500">Per Gift</p>
          </div>
        </div>
      </div>

      {/* Add Giving Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Giving</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newGiving.memberId}
                onChange={(e) => setNewGiving({...newGiving, memberId: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={newGiving.amount}
                onChange={(e) => setNewGiving({...newGiving, amount: parseFloat(e.target.value)})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <select
                value={newGiving.type}
                onChange={(e) => setNewGiving({...newGiving, type: e.target.value as Giving['type']})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {givingTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>

              <select
                value={newGiving.fund}
                onChange={(e) => setNewGiving({...newGiving, fund: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {funds.map(fund => (
                  <option key={fund} value={fund}>{fund}</option>
                ))}
              </select>

              <input
                type="date"
                value={newGiving.date}
                onChange={(e) => setNewGiving({...newGiving, date: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <select
                value={newGiving.paymentMethod}
                onChange={(e) => setNewGiving({...newGiving, paymentMethod: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newGiving.recurring}
                  onChange={(e) => setNewGiving({...newGiving, recurring: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Recurring Gift</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newGiving.taxDeductible}
                  onChange={(e) => setNewGiving({...newGiving, taxDeductible: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Tax Deductible</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Record Giving
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              {givingTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <input
              type="month"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredGiving.length} records • ${filteredGiving.reduce((sum, g) => sum + g.amount, 0).toLocaleString()} total
          </div>
        </div>
      </div>

      {/* Top Givers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Givers (All Time)</h3>
        <div className="space-y-3">
          {topGivers.map((member, index) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <span className="font-semibold text-green-600">${member.totalGiving.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Giving */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Giving</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredGiving
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map((gift, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{gift.memberName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{gift.type.charAt(0).toUpperCase() + gift.type.slice(1)}</span>
                            <span>{gift.fund}</span>
                            <span>{new Date(gift.date).toLocaleDateString()}</span>
                            <span>{gift.paymentMethod}</span>
                            {gift.recurring && <span className="text-blue-600">Recurring</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            ${gift.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            {gift.taxDeductible && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Tax Deductible</span>
                            )}
                            {gift.receiptSent && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Receipt Sent</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GivingManagement;