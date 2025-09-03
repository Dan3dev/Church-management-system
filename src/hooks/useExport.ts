import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const { formatCurrency, t, state } = useApp();

  const exportToCSV = (data: any[], filename: string, title?: string) => {
    setExporting(true);
    
    try {
      if (data.length === 0) {
        throw new Error('No data to export');
      }

      // Create CSV with proper formatting for Kenyan context
      const headers = Object.keys(data[0]);
      const csvContent = [
        // Add title and metadata for Kenyan context
        title ? `"${title}"` : '',
        `"Generated on: ${new Date().toLocaleDateString('en-KE', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}"`,
        `"Time: ${new Date().toLocaleTimeString('en-KE')}"`,
        `"Currency: ${state.baseCurrency}"`,
        `"Language: ${state.languages.find(l => l.code === state.currentLanguage)?.name || state.currentLanguage}"`,
        `"Church Management System - Kenya Edition"`,
        '', // Empty line
        headers.map(header => `"${header}"`).join(','),
        ...data.map(row => 
          headers.map(header => {
            let value = row[header];
            
            // Format currency values for Kenyan context
            if (typeof value === 'number' && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('balance') || header.toLowerCase().includes('income') || header.toLowerCase().includes('expense'))) {
              value = formatCurrency(value);
            }
            
            // Handle dates in Kenyan format
            if (header.toLowerCase().includes('date') && value) {
              try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  value = date.toLocaleDateString('en-KE');
                }
              } catch (e) {
                // Keep original value if date parsing fails
              }
            }
            
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value || ''}"`;
          }).join(',')
        )
      ].join('\n');

      // Create and download file with proper BOM for Excel compatibility
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async (data: any[], filename: string, title: string, reportType: string = 'general') => {
    setExporting(true);
    
    try {
      // Create comprehensive HTML for PDF with Kenyan formatting
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="${state.currentLanguage}" dir="${state.languages.find(l => l.code === state.currentLanguage)?.isRTL ? 'rtl' : 'ltr'}">
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white;
                color: #333;
                line-height: 1.6;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 3px solid #059669;
                padding-bottom: 20px;
                background: linear-gradient(135deg, #059669, #10b981);
                color: white;
                margin: -20px -20px 30px -20px;
                padding: 30px 20px 20px 20px;
              }
              .header h1 { 
                margin: 0 0 10px 0; 
                font-size: 32px;
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
              }
              .header .subtitle { 
                font-size: 18px; 
                margin: 5px 0;
                opacity: 0.9;
              }
              .kenyan-flag {
                display: inline-block;
                margin: 0 10px;
                font-size: 24px;
              }
              .metadata {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
                padding: 20px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              .metadata-item {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .metadata-label {
                font-size: 12px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .metadata-value {
                font-size: 18px;
                font-weight: bold;
                color: #1e293b;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
              }
              th { 
                background: linear-gradient(135deg, #059669, #10b981); 
                color: white; 
                padding: 15px 12px; 
                text-align: left; 
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              td { 
                border: 1px solid #e2e8f0; 
                padding: 12px; 
                font-size: 13px;
                background: white;
              }
              tr:nth-child(even) td { 
                background: #f8fafc; 
              }
              tr:hover td {
                background: #e0f2fe;
              }
              .currency {
                font-weight: 600;
                color: #059669;
                text-align: right;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
                text-align: center;
                font-size: 12px;
                color: #64748b;
                background: #f8fafc;
                margin-left: -20px;
                margin-right: -20px;
                margin-bottom: -20px;
                padding: 20px;
              }
              .summary-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
              }
              .stat-card {
                background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                border: 1px solid #cbd5e1;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #059669;
                margin-bottom: 5px;
              }
              .stat-label {
                font-size: 14px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .kenyan-context {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
              }
              .kenyan-context h3 {
                color: #92400e;
                margin: 0 0 10px 0;
                font-size: 16px;
              }
              .kenyan-context p {
                color: #78350f;
                margin: 0;
                font-size: 14px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
                .header { margin: -20px -20px 20px -20px; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <div class="subtitle">
                <span class="kenyan-flag">🇰🇪</span>
                ChurchHub Management System - Kenya Edition
                <span class="kenyan-flag">🇰🇪</span>
              </div>
              <div class="subtitle">Empowering Kenyan Churches with Technology</div>
            </div>
            
            <div class="kenyan-context">
              <h3>🏛️ Kenyan Church Management System</h3>
              <p>Designed specifically for Kenyan churches with support for M-Pesa, multiple currencies, and local languages including Kiswahili</p>
            </div>
            
            <div class="metadata">
              <div class="metadata-item">
                <div class="metadata-label">Generated On</div>
                <div class="metadata-value">${new Date().toLocaleDateString('en-KE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Time (EAT)</div>
                <div class="metadata-value">${new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' })}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Base Currency</div>
                <div class="metadata-value">${state.baseCurrency} (${state.currencies.find(c => c.code === state.baseCurrency)?.name})</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Language</div>
                <div class="metadata-value">${state.languages.find(l => l.code === state.currentLanguage)?.nativeName || state.currentLanguage}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Records</div>
                <div class="metadata-value">${data.length}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Report Type</div>
                <div class="metadata-value">${reportType.charAt(0).toUpperCase() + reportType.slice(1)}</div>
              </div>
            </div>

            ${reportType === 'financial' ? `
              <div class="summary-stats">
                <div class="stat-card">
                  <div class="stat-value">${formatCurrency(data.filter((d: any) => d.Type === 'Income').reduce((sum: number, d: any) => sum + (parseFloat(d.Amount?.toString().replace(/[^0-9.-]/g, '')) || 0), 0))}</div>
                  <div class="stat-label">Total Income</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${formatCurrency(data.filter((d: any) => d.Type === 'Expense').reduce((sum: number, d: any) => sum + (parseFloat(d.Amount?.toString().replace(/[^0-9.-]/g, '')) || 0), 0))}</div>
                  <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.length}</div>
                  <div class="stat-label">Total Transactions</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${formatCurrency(data.filter((d: any) => d['Payment Method']?.includes('M-Pesa')).reduce((sum: number, d: any) => sum + (parseFloat(d.Amount?.toString().replace(/[^0-9.-]/g, '')) || 0), 0))}</div>
                  <div class="stat-label">M-Pesa Transactions</div>
                </div>
              </div>
            ` : ''}

            <table>
              <thead>
                <tr>
                  ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${data.map(row => `
                  <tr>
                    ${Object.entries(row).map(([key, value]) => {
                      let cellValue = value || '';
                      // Apply currency formatting for amount fields
                      if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('balance') || key.toLowerCase().includes('income') || key.toLowerCase().includes('expense'))) {
                        cellValue = formatCurrency(value);
                      }
                      return `<td class="${key.toLowerCase().includes('amount') || key.toLowerCase().includes('balance') ? 'currency' : ''}">${cellValue}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p><strong>ChurchHub Management System - Kenya Edition</strong></p>
              <p>🇰🇪 Proudly serving Kenyan churches with technology solutions</p>
              <p>Report contains ${data.length} records as of ${new Date().toLocaleDateString('en-KE')}</p>
              <p>All amounts are displayed in ${state.baseCurrency} • Generated at ${new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' })} EAT</p>
              <p>For support: info@churchhub.co.ke | +254 700 000 000</p>
            </div>
          </body>
        </html>
      `;

      // Create and download HTML file (which can be opened as PDF)
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.html`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      return false;
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async (data: any[], filename: string, title: string) => {
    setExporting(true);
    
    try {
      // Create Excel-compatible CSV with proper formatting for Kenyan context
      const headers = Object.keys(data[0] || {});
      const excelContent = [
        // Excel metadata with Kenyan context
        `"${title}"`,
        `"ChurchHub Kenya Edition"`,
        `"Generated: ${new Date().toLocaleDateString('en-KE')} at ${new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' })} EAT"`,
        `"Currency: ${state.baseCurrency}"`,
        `"Language: ${state.languages.find(l => l.code === state.currentLanguage)?.name}"`,
        `"Records: ${data.length}"`,
        '',
        headers.map(header => `"${header}"`).join(','),
        ...data.map(row => 
          headers.map(header => {
            let value = row[header];
            
            // Format for Excel with Kenyan context
            if (typeof value === 'number' && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('balance'))) {
              return value; // Keep as number for Excel calculations
            }
            
            // Format dates for Kenyan context
            if (header.toLowerCase().includes('date') && value) {
              try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString('en-KE');
                }
              } catch (e) {
                // Keep original value
              }
            }
            
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value || ''}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Excel export failed:', error);
      return false;
    } finally {
      setExporting(false);
    }
  };

  // Kenyan-specific export for M-Pesa and mobile money transactions
  const exportMobileMoneyReport = (data: any[], filename: string) => {
    const mobileMoneyData = data.filter(d => 
      d['Payment Method']?.includes('M-Pesa') || 
      d['Payment Method']?.includes('Mobile Money') ||
      d['Payment Method']?.includes('Airtel Money')
    );

    const reportData = mobileMoneyData.map(transaction => ({
      'Date': transaction.Date,
      'Transaction Type': transaction.Type,
      'Amount (KES)': transaction.Amount,
      'Mobile Money Provider': transaction['Payment Method'],
      'Reference Number': transaction['Reference Number'] || 'N/A',
      'Member': transaction.Member || 'Anonymous',
      'Description': transaction.Description,
      'Status': 'Completed'
    }));

    return exportToCSV(reportData, `mobile_money_${filename}`, 'Mobile Money Transactions Report - Kenya');
  };

  // Export member data with Kenyan context
  const exportMembersKenyan = (members: any[]) => {
    const kenyanMemberData = members.map(member => ({
      'Full Name': `${member.firstName} ${member.lastName}`,
      'ID Number': member.idNumber || 'Not Provided',
      'Phone Number': member.phone,
      'Email Address': member.email,
      'County': member.county || 'Not Specified',
      'Constituency': member.constituency || 'Not Specified',
      'Ward': member.ward || 'Not Specified',
      'Membership Status': member.membershipStatus,
      'Join Date': new Date(member.joinDate).toLocaleDateString('en-KE'),
      'Ministry': member.ministry.join(', '),
      'Campus': member.campus,
      'Age': Math.floor((new Date().getTime() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
      'Marital Status': member.maritalStatus || 'Not Specified',
      'Occupation': member.occupation || 'Not Specified',
      'Emergency Contact': member.emergencyContact.name,
      'Emergency Phone': member.emergencyContact.phone,
      'Language Preference': member.preferences.communicationLanguage,
      'SMS Notifications': member.preferences.smsNotifications ? 'Yes' : 'No',
      'Email Notifications': member.preferences.emailNotifications ? 'Yes' : 'No'
    }));

    return exportToCSV(kenyanMemberData, 'kenyan_church_members', 'Church Members Report - Kenya');
  };

  return {
    exportToCSV,
    exportToPDF,
    exportToExcel,
    exportMobileMoneyReport,
    exportMembersKenyan,
    exporting
  };
};