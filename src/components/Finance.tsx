import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';

const Finance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Income</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$25,450</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$5,200</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Net Balance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$20,250</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <p className="text-gray-600">Transaction history coming soon</p>
      </div>
    </div>
  );
};

export default Finance;
