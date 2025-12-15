import React from 'react';
import { Brain } from 'lucide-react';

const AIInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600 mt-2">Church analytics and AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Member Trends</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">+12%</p>
            </div>
            <Brain className="h-10 w-10 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Engagement Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">8.2/10</p>
            </div>
            <Brain className="h-10 w-10 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Growth Forecast</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">+8.5%</p>
            </div>
            <Brain className="h-10 w-10 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Insights & Recommendations</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <p className="font-medium text-gray-900">Increase Small Group Engagement</p>
            <p className="text-sm text-gray-600 mt-1">Members in active small groups show 3x higher attendance rates</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-medium text-gray-900">Peak Event Times</p>
            <p className="text-sm text-gray-600 mt-1">Weekend services at 10:30 AM show optimal attendance</p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-4 py-2">
            <p className="font-medium text-gray-900">Giving Patterns</p>
            <p className="text-sm text-gray-600 mt-1">Giving increases after community outreach events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
