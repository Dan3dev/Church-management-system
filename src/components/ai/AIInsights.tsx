import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, X, Lightbulb, Target, RefreshCw, Bell } from 'lucide-react';
import { AIInsight, Member, FinancialTransaction, AttendanceRecord, Giving } from '../../types';
import { useApp } from '../../context/AppContext';

interface AIInsightsProps {
  members: Member[];
  transactions: FinancialTransaction[];
  attendance: AttendanceRecord[];
  giving: Giving[];
  onNotification?: (notification: any) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ members, transactions, attendance, giving, onNotification }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { formatCurrency, t, sendNotification } = useApp();

  useEffect(() => {
    generateInsights();
    
    // Auto-refresh insights every 5 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(generateInsights, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [members, transactions, attendance, giving, autoRefresh]);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        title: t('membershipGrowthForecast') || 'Membership Growth Forecast',
        description: t('membershipGrowthDescription', Math.round(growthRate)) || `Based on current trends, you're projected to gain ${Math.round(growthRate)} new members this year. Consider expanding small group capacity and preparing for increased facility needs.`,
        confidence: 85,
        category: 'membership',
        data: { growthRate, recentMembers: recentMembers.length, projectedTotal: members.length + growthRate },
        actionable: true,
        actions: [
          { id: '1', label: t('viewSmallGroups') || 'View Small Groups', type: 'navigate', target: 'smallgroups' },
          { id: '2', label: t('planExpansion') || 'Plan Expansion', type: 'create', target: 'events' },
          { id: '3', label: t('reviewCapacity') || 'Review Capacity', type: 'navigate', target: 'campuses' }
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
        title: t('budgetDeficitAlert') || 'Budget Deficit Alert',
        description: t('budgetDeficitDescription', formatCurrency(Math.abs(netIncome))) || `This month shows a deficit of ${formatCurrency(Math.abs(netIncome))}. Immediate action recommended: review expenses, consider fundraising initiatives, or adjust budget allocations.`,
        confidence: 95,
        category: 'finance',
        data: { deficit: Math.abs(netIncome), income: monthlyIncome, expenses: monthlyExpenses, severity: 'high' },
        actionable: true,
        actions: [
          { id: '1', label: t('reviewExpenses') || 'Review Expenses', type: 'navigate', target: 'finance' },
          { id: '2', label: t('planFundraiser') || 'Plan Fundraiser', type: 'create', target: 'events' },
          { id: '3', label: t('budgetAnalysis') || 'Budget Analysis', type: 'navigate', target: 'reports' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    } else if (netIncome > monthlyIncome * 0.3) {
      newInsights.push({
        id: '2b',
        type: 'recommendation',
        title: t('surplusInvestmentOpportunity') || 'Surplus Investment Opportunity',
        description: t('surplusInvestmentDescription', formatCurrency(netIncome)) || `Strong financial position with ${formatCurrency(netIncome)} surplus. Consider investing in ministry expansion, building improvements, or emergency fund growth.`,
        confidence: 88,
        category: 'finance',
        data: { surplus: netIncome, percentage: (netIncome / monthlyIncome) * 100 },
        actionable: true,
        actions: [
          { id: '1', label: t('investmentOptions') || 'Investment Options', type: 'navigate', target: 'accounts' },
          { id: '2', label: t('ministryExpansion') || 'Ministry Expansion', type: 'navigate', target: 'ministries' }
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
        title: 'Attendance Improvement Strategy',
        description: `Current attendance rate is ${attendanceRate.toFixed(1)}%. Implement targeted follow-up programs, improve service experience, and consider member engagement initiatives.`,
        confidence: 78,
        category: 'attendance',
        data: { 
          rate: attendanceRate, 
          totalRecords: recentAttendance.length,
          absentMembers: recentAttendance.filter(a => !a.present).length,
          recommendations: ['Follow-up calls', 'Service improvements', 'Engagement events']
        },
        actionable: true,
        actions: [
          { id: '1', label: 'Setup Follow-up', type: 'navigate', target: 'communication' },
          { id: '2', label: 'View Attendance', type: 'navigate', target: 'attendance' },
          { id: '3', label: 'Plan Engagement Event', type: 'create', target: 'events' }
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
      const trend = averageGiving > 0 ? ((recentAverage - averageGiving) / averageGiving) * 100 : 0;

      newInsights.push({
        id: '4',
        type: 'trend',
        title: 'Giving Trend Analysis',
        description: `Giving has ${trend > 0 ? 'increased' : 'decreased'} by ${Math.abs(trend).toFixed(1)}% compared to historical average. ${trend > 0 ? 'Excellent stewardship momentum!' : 'Consider implementing stewardship education and giving campaigns.'}`,
        confidence: 82,
        category: 'giving',
        data: { 
          trend, 
          recentAverage, 
          historicalAverage: averageGiving,
          trendDirection: trend > 0 ? 'positive' : 'negative',
          impactLevel: Math.abs(trend) > 10 ? 'high' : 'moderate'
        },
        actionable: Math.abs(trend) > 5,
        actions: trend < -5 ? [
          { id: '1', label: 'Plan Stewardship Series', type: 'create', target: 'sermons' },
          { id: '2', label: 'Review Giving Reports', type: 'navigate', target: 'giving' },
          { id: '3', label: 'Member Outreach', type: 'navigate', target: 'communication' }
        ] : [
          { id: '1', label: 'Celebrate Success', type: 'create', target: 'communication' },
          { id: '2', label: 'Share Testimony', type: 'navigate', target: 'sermons' }
        ],
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
        description: `${disengagedMembers.length} active members haven't attended in the past month. Risk of member attrition detected. Immediate pastoral care and outreach recommended.`,
        confidence: 90,
        category: 'engagement',
        data: { 
          count: disengagedMembers.length, 
          members: disengagedMembers.slice(0, 5),
          riskLevel: disengagedMembers.length > 10 ? 'high' : 'moderate',
          suggestedActions: ['Personal calls', 'Home visits', 'Care packages']
        },
        actionable: true,
        actions: [
          { id: '1', label: 'Send Follow-up', type: 'navigate', target: 'communication' },
          { id: '2', label: 'Schedule Visits', type: 'create', target: 'events' },
          { id: '3', label: 'Assign Pastoral Care', type: 'navigate', target: 'users' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Ministry Participation Analysis
    const membersWithoutMinistry = members.filter(m => 
      m.membershipStatus === 'Active' && m.ministry.length === 0
    );

    if (membersWithoutMinistry.length > 0) {
      newInsights.push({
        id: '6',
        type: 'recommendation',
        title: 'Ministry Engagement Opportunity',
        description: `${membersWithoutMinistry.length} active members are not involved in any ministry. Increase member engagement by connecting them with suitable ministry opportunities.`,
        confidence: 75,
        category: 'engagement',
        data: { 
          count: membersWithoutMinistry.length,
          percentage: (membersWithoutMinistry.length / members.filter(m => m.membershipStatus === 'Active').length) * 100,
          members: membersWithoutMinistry.slice(0, 3)
        },
        actionable: true,
        actions: [
          { id: '1', label: 'Ministry Fair', type: 'create', target: 'events' },
          { id: '2', label: 'Personal Outreach', type: 'navigate', target: 'communication' },
          { id: '3', label: 'View Ministries', type: 'navigate', target: 'ministries' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // Seasonal Giving Prediction
    const currentMonth = new Date().getMonth();
    if (currentMonth === 10 || currentMonth === 11) { // November or December
      const lastYearHoliday = giving.filter(g => {
        const date = new Date(g.date);
        return date.getMonth() === 11 && date.getFullYear() === new Date().getFullYear() - 1;
      });
      
      if (lastYearHoliday.length > 0) {
        const lastYearTotal = lastYearHoliday.reduce((sum, g) => sum + g.amount, 0);
        newInsights.push({
          id: '7',
          type: 'prediction',
          title: 'Holiday Giving Forecast',
          description: `Based on last year's patterns, expect approximately $${(lastYearTotal * 1.1).toLocaleString()} in holiday giving. Prepare special campaigns and thanksgiving initiatives.`,
          confidence: 72,
          category: 'giving',
          data: { 
            lastYearTotal, 
            projectedTotal: lastYearTotal * 1.1,
            growthFactor: 1.1,
            seasonalTrend: 'positive'
          },
          actionable: true,
          actions: [
            { id: '1', label: 'Plan Holiday Campaign', type: 'create', target: 'events' },
            { id: '2', label: 'Prepare Communications', type: 'navigate', target: 'communication' }
          ],
          createdAt: new Date().toISOString(),
          dismissed: false
        });
      }
    }

    // Volunteer Burnout Detection
    const activeVolunteers = members.filter(m => m.ministry.length > 2);
    if (activeVolunteers.length > 0) {
      newInsights.push({
        id: '8',
        type: 'alert',
        title: 'Volunteer Burnout Risk',
        description: `${activeVolunteers.length} members are involved in 3+ ministries. Monitor for burnout and consider redistributing responsibilities to prevent volunteer fatigue.`,
        confidence: 68,
        category: 'engagement',
        data: { 
          count: activeVolunteers.length,
          overcommittedMembers: activeVolunteers.map(m => ({
            name: `${m.firstName} ${m.lastName}`,
            ministryCount: m.ministry.length
          }))
        },
        actionable: true,
        actions: [
          { id: '1', label: 'Review Assignments', type: 'navigate', target: 'volunteers' },
          { id: '2', label: 'Recruit New Volunteers', type: 'navigate', target: 'members' }
        ],
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    // New Member Integration Success
    const newMembersLastMonth = members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      return joinDate >= twoMonthsAgo && joinDate < oneMonthAgo;
    });

    const integratedNewMembers = newMembersLastMonth.filter(m => 
      m.ministry.length > 0 || attendance.some(a => a.memberId === m.id && a.present)
    );

    if (newMembersLastMonth.length > 0) {
      const integrationRate = (integratedNewMembers.length / newMembersLastMonth.length) * 100;
      newInsights.push({
        id: '9',
        type: integrationRate > 70 ? 'trend' : 'recommendation',
        title: 'New Member Integration Analysis',
        description: `${integrationRate.toFixed(1)}% of new members from last month are actively engaged. ${integrationRate > 70 ? 'Excellent integration process!' : 'Consider improving new member onboarding and follow-up procedures.'}`,
        confidence: 80,
        category: 'membership',
        data: { 
          integrationRate,
          totalNewMembers: newMembersLastMonth.length,
          integratedCount: integratedNewMembers.length,
          needsAttention: newMembersLastMonth.filter(m => !integratedNewMembers.includes(m))
        },
        actionable: integrationRate < 70,
        actions: integrationRate < 70 ? [
          { id: '1', label: 'Improve Onboarding', type: 'navigate', target: 'events' },
          { id: '2', label: 'Follow-up Program', type: 'navigate', target: 'communication' }
        ] : undefined,
        createdAt: new Date().toISOString(),
        dismissed: false
      });
    }

    setInsights(newInsights);
    setLoading(false);

    // Send notifications for high-priority insights
    const criticalInsights = newInsights.filter(i => 
      i.type === 'alert' || (i.confidence > 85 && i.actionable)
    );
    
    criticalInsights.forEach(insight => {
      sendNotification({
      onNotification?.({
        type: insight.type === 'alert' ? 'warning' : 'info',
        title: t('newAIInsight') || 'New AI Insight',
        message: insight.title,
        userId: 'system',
        priority: insight.type === 'alert' ? 'high' : 'medium',
        category: 'ai-insights',
        read: false
      });
    });
  };

  const dismissInsight = (id: string) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, dismissed: true } : insight
    ));
    
    sendNotification({
      type: 'success',
      title: t('insightDismissed') || 'Insight Dismissed',
      message: t('aiInsightDismissed') || 'AI insight has been dismissed',
      userId: 'system',
      priority: 'low',
      category: 'ai-insights'
    });
  };

  const executeAction = (action: any, insight: AIInsight) => {
    console.log('Executing AI action:', action);
    
    sendNotification({
      type: 'info',
      title: t('actionExecuted') || 'Action Executed',
      message: t('navigatingTo', action.label) || `Navigating to ${action.label}`,
      userId: 'system',
      priority: 'low',
      category: 'ai-insights'
    });
    
    // In a real app, this would trigger navigation or actions
    if (action.type === 'navigate') {
      // Simulate navigation
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: action.target }));
      }, 100);
    }
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

  const getPriorityLevel = (insight: AIInsight) => {
    if (insight.type === 'alert') return 'High';
    if (insight.confidence > 85) return 'Medium';
    return 'Low';
  };

  const activeInsights = insights.filter(i => !i.dismissed);
  const criticalInsights = activeInsights.filter(i => i.type === 'alert');
  const actionableInsights = activeInsights.filter(i => i.actionable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('aiInsightsPredictions') || 'AI Insights & Predictions'}</h2>
            <p className="text-gray-600">{t('poweredByML') || 'Powered by machine learning analytics'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{t('autoRefresh') || 'Auto-refresh'}</span>
          </label>
          <button
            onClick={generateInsights}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? t('analyzing') || 'Analyzing...' : t('refreshInsights') || 'Refresh Insights'}</span>
          </button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{activeInsights.length}</p>
            <p className="text-sm text-gray-500">{t('activeInsights') || 'Active Insights'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{criticalInsights.length}</p>
            <p className="text-sm text-gray-500">{t('criticalAlerts') || 'Critical Alerts'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{actionableInsights.length}</p>
            <p className="text-sm text-gray-500">{t('actionableItems') || 'Actionable Items'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(activeInsights.reduce((sum, i) => sum + i.confidence, 0) / activeInsights.length) || 0}%
            </p>
            <p className="text-sm text-gray-500">{t('avgConfidence') || 'Avg Confidence'}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">{t('analyzingChurchData') || 'Analyzing church data...'}</p>
              <p className="text-sm text-gray-500">{t('generatingAIInsights') || 'Generating AI-powered insights and predictions'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const color = getInsightColor(insight.type);
            const priority = getPriorityLevel(insight);
            
            return (
              <div key={insight.id} className={`bg-white rounded-xl shadow-sm border-l-4 border-${color}-500 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${color}-100`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-700`}>
                          {insight.confidence}% {t('confidence') || 'confidence'}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                          {insight.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          priority === 'High' ? 'bg-red-100 text-red-700' :
                          priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {priority} {t('priority') || 'Priority'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">{insight.description}</p>
                      
                      {/* Data Visualization */}
                      {insight.data && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">{t('keyMetrics') || 'Key Metrics'}:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {Object.entries(insight.data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="font-medium text-gray-900">
                                  {typeof value === 'number' ? 
                                    (key.includes('Rate') || key.includes('Percentage') ? `${value.toFixed(1)}%` : 
                                     key.includes('Amount') || key.includes('Total') || key.includes('Income') || key.includes('Expense') ? `$${value.toLocaleString()}` :
                                     value.toLocaleString()) : 
                                    String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {insight.actions && insight.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {insight.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => executeAction(action, insight)}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noActiveInsights') || 'No Active Insights'}</h3>
          <p className="text-gray-500 mb-4">{t('aiAnalyzingData') || 'AI is analyzing your data. Check back later for personalized insights.'}</p>
          <button
            onClick={generateInsights}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('generateNewInsights') || 'Generate New Insights'}
          </button>
        </div>
      )}

      {/* Insight Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('insightCategories') || 'Insight Categories'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['membership', 'finance', 'attendance', 'giving', 'engagement'].map(category => {
            const categoryInsights = activeInsights.filter(i => i.category === category);
            return (
              <div key={category} className="text-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <p className="font-semibold text-gray-900 capitalize">{category}</p>
                <p className="text-2xl font-bold text-blue-600">{categoryInsights.length}</p>
                <p className="text-xs text-gray-500">{t('insights') || 'insights'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;