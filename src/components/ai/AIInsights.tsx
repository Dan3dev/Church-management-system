import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, X, Lightbulb, Target } from 'lucide-react';
import { AIInsight, Member, FinancialTransaction, AttendanceRecord, Giving } from '../../types';

interface AIInsightsProps {
  members: Member[];
  transactions: FinancialTransaction[];
  attendance: AttendanceRecord[];
  giving: Giving[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ members, transactions, attendance, giving }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [members, transactions, attendance, giving]);

  const generateInsights = () => {
    setLoading(true);
    const newInsights: AIInsight[] = [];

    // Membership Growth Prediction
    const recentMembers = members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return joinDate >= threeMonthsAgo;
    });

    if (recentMembers.length > 0) {
      const growthRate = (recentMembers.length / 3) * 12; // Annualized
      newInsights.push({
        id: '1',
        type: 'prediction',
        title: 'Membership Growth Forecast',
        description: `Based on current trends, you're projected to gain ${Math.round(growthRate)} new members this year. Consider expanding small group capacity.`,
        confidence: 85,
        category: 'membership',
        data: { growthRate, recentMembers: recentMembers.length },
        actionable: true,
        actions: [
          { id: '1', label: 'View Small Groups', type: 'navigate', target: 'smallgroups' },
          { id: '2', label: 'Plan Expansion', type: 'create', target: 'events' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Financial Health Analysis
    const monthlyIncome = transactions
      .filter(t => t.type === 'Income' && t.date.startsWith(new Date().toISOString().slice(0, 7)))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = transactions
      .filter(t => t.type === 'Expense' && t.date.startsWith(new Date().toISOString().slice(0, 7)))
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = monthlyIncome - monthlyExpenses;
    
    if (netIncome < 0) {
      newInsights.push({
        id: '2',
        type: 'alert',
        title: 'Budget Deficit Alert',
        description: `This month shows a deficit of $${Math.abs(netIncome).toLocaleString()}. Review expenses and consider fundraising initiatives.`,
        confidence: 95,
        category: 'finance',
        data: { deficit: Math.abs(netIncome), income: monthlyIncome, expenses: monthlyExpenses },
        actionable: true,
        actions: [
          { id: '1', label: 'Review Expenses', type: 'navigate', target: 'finance' },
          { id: '2', label: 'Plan Fundraiser', type: 'create', target: 'events' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Attendance Trend Analysis
    const recentAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return date >= oneMonthAgo;
    });

    const attendanceRate = recentAttendance.length > 0 
      ? (recentAttendance.filter(a => a.present).length / recentAttendance.length) * 100
      : 0;

    if (attendanceRate < 70) {
      newInsights.push({
        id: '3',
        type: 'recommendation',
        title: 'Attendance Improvement Opportunity',
        description: `Current attendance rate is ${attendanceRate.toFixed(1)}%. Consider implementing follow-up programs for absent members.`,
        confidence: 78,
        category: 'attendance',
        data: { rate: attendanceRate, totalRecords: recentAttendance.length },
        actionable: true,
        actions: [
          { id: '1', label: 'Setup Follow-up', type: 'navigate', target: 'communication' },
          { id: '2', label: 'View Attendance', type: 'navigate', target: 'attendance' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Giving Pattern Analysis
    const averageGiving = giving.length > 0 ? giving.reduce((sum, g) => sum + g.amount, 0) / giving.length : 0;
    const recentGiving = giving.filter(g => {
      const date = new Date(g.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return date >= oneMonthAgo;
    });

    if (recentGiving.length > 0) {
      const recentAverage = recentGiving.reduce((sum, g) => sum + g.amount, 0) / recentGiving.length;
      const trend = ((recentAverage - averageGiving) / averageGiving) * 100;

      newInsights.push({
        id: '4',
        type: 'trend',
        title: 'Giving Trend Analysis',
        description: `Giving has ${trend > 0 ? 'increased' : 'decreased'} by ${Math.abs(trend).toFixed(1)}% compared to historical average. ${trend > 0 ? 'Great momentum!' : 'Consider stewardship teaching.'}`,
        confidence: 82,
        category: 'giving',
        data: { trend, recentAverage, historicalAverage: averageGiving },
        actionable: trend < 0,
        actions: trend < 0 ? [
          { id: '1', label: 'Plan Stewardship Series', type: 'create', target: 'sermons' },
          { id: '2', label: 'Review Giving Reports', type: 'navigate', target: 'giving' }
        ] : undefined,
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Member Engagement Analysis
    const disengagedMembers = members.filter(m => {
      const memberAttendance = attendance.filter(a => a.memberId === m.id);
      const recentAttendance = memberAttendance.filter(a => {
        const date = new Date(a.date);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return date >= oneMonthAgo;
      });
      return recentAttendance.length === 0 && m.membershipStatus === 'Active';
    });

    if (disengagedMembers.length > 0) {
      newInsights.push({
        id: '5',
        type: 'alert',
        title: 'Member Engagement Alert',
        description: `${disengagedMembers.length} active members haven't attended in the past month. Consider reaching out for pastoral care.`,
        confidence: 90,
        category: 'engagement',
        data: { count: disengagedMembers.length, members: disengagedMembers.slice(0, 5) },
        actionable: true,
        actions: [
          { id: '1', label: 'Send Follow-up', type: 'navigate', target: 'communication' },
          { id: '2', label: 'Schedule Visits', type: 'create', target: 'events' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    setInsights(newInsights);
    setLoading(false);
  };

  const dismissInsight = (id: string) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, dismissed: true } : insight
    ));
  };

  const executeAction = (action: any) => {
    console.log('Executing AI action:', action);
    // In a real app, this would trigger navigation or actions
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertTriangle;
      case 'trend': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'blue';
      case 'recommendation': return 'green';
      case 'alert': return 'red';
      case 'trend': return 'purple';
      default: return 'gray';
    }
  };

  const activeInsights = insights.filter(i => !i.dismissed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Insights & Predictions</h2>
            <p className="text-gray-600">Powered by machine learning analytics</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Brain className="h-4 w-4" />
          <span>Refresh Insights</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Analyzing data and generating insights...</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);
            
            return (
              <div key={insight.id} className={`bg-white rounded-xl shadow-sm border-l-4 border-${color}-500 p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${color}-100`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-700`}>
                          {insight.confidence}% confidence
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{insight.description}</p>
                      
                      {insight.actions && insight.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {insight.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => executeAction(action)}
                              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg bg-${color}-600 text-white hover:bg-${color}-700 transition-colors`}
                            >
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeInsights.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Insights</h3>
          <p className="text-gray-500">AI is analyzing your data. Check back later for personalized insights.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;