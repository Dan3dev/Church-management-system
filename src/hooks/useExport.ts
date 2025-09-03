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
        // Add title and metadata
        title ? `"${title}"` : '',
        `"Generated on: ${new Date().toLocaleDateString('en-KE')}"`,
        `"Currency: ${state.baseCurrency}"`,
        `"Language: ${state.currentLanguage}"`,
        '', // Empty line
        headers.map(header => `"${header}"`).join(','),
        ...data.map(row => 
          headers.map(header => {
            let value = row[header];
            
            // Format currency values for Kenyan context
            if (typeof value === 'number' && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('balance'))) {
              value = formatCurrency(value);
            }
            
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value || ''}"`;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
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
        <html lang="${state.currentLanguage}">
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
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #3B82F6;
                padding-bottom: 20px;
              }
              .header h1 { 
                color: #1F2937; 
                margin: 0 0 10px 0; 
                font-size: 28px;
                font-weight: bold;
              }
              .header .subtitle { 
                color: #6B7280; 
                font-size: 16px; 
                margin: 5px 0;
              }
              .metadata {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
                padding: 15px;
                background: #F9FAFB;
                border-radius: 8px;
              }
              .metadata-item {
                text-align: center;
              }
              .metadata-label {
                font-size: 12px;
                color: #6B7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .metadata-value {
                font-size: 16px;
                font-weight: bold;
                color: #1F2937;
                margin-top: 5px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              th { 
                background: #3B82F6; 
                color: white; 
                padding: 12px 8px; 
                text-align: left; 
                font-weight: 600;
                font-size: 14px;
              }
              td { 
                border: 1px solid #E5E7EB; 
                padding: 10px 8px; 
                font-size: 13px;
              }
              tr:nth-child(even) { 
                background: #F9FAFB; 
              }
              tr:hover {
                background: #EFF6FF;
              }
              .currency {
                font-weight: 600;
                color: #059669;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #E5E7EB;
                text-align: center;
                font-size: 12px;
                color: #6B7280;
              }
              .summary-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 20px 0;
              }
              .stat-card {
                background: #F3F4F6;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
              }
              .stat-value {
                font-size: 20px;
                font-weight: bold;
                color: #1F2937;
              }
              .stat-label {
                font-size: 12px;
                color: #6B7280;
                margin-top: 5px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <div class="subtitle">ChurchHub Management System</div>
              <div class="subtitle">Kenya Edition</div>
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
                <div class="metadata-label">Time</div>
                <div class="metadata-value">${new Date().toLocaleTimeString('en-KE')}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Currency</div>
                <div class="metadata-value">${state.baseCurrency}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Language</div>
                <div class="metadata-value">${state.languages.find(l => l.code === state.currentLanguage)?.name || state.currentLanguage}</div>
              </div>
            </div>

            ${reportType === 'financial' ? `
              <div class="summary-stats">
                <div class="stat-card">
                  <div class="stat-value currency">${formatCurrency(data.filter((d: any) => d.Type === 'Income').reduce((sum: number, d: any) => sum + (parseFloat(d.Amount?.toString().replace(/[^0-9.-]/g, '')) || 0), 0))}</div>
                  <div class="stat-label">Total Income</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value currency">${formatCurrency(data.filter((d: any) => d.Type === 'Expense').reduce((sum: number, d: any) => sum + (parseFloat(d.Amount?.toString().replace(/[^0-9.-]/g, '')) || 0), 0))}</div>
                  <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.length}</div>
                  <div class="stat-label">Total Transactions</div>
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
                      if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('balance'))) {
                        cellValue = formatCurrency(value);
                      }
                      return `<td class="${key.toLowerCase().includes('amount') || key.toLowerCase().includes('balance') ? 'currency' : ''}">${cellValue}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Generated by ChurchHub Management System - Kenya Edition</p>
              <p>Report contains ${data.length} records as of ${new Date().toLocaleDateString('en-KE')}</p>
              <p>All amounts are displayed in ${state.baseCurrency}</p>
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
      // Create Excel-compatible CSV with proper formatting
      const headers = Object.keys(data[0] || {});
      const excelContent = [
        // Excel metadata
        `"${title}"`,
        `"Generated: ${new Date().toLocaleDateString('en-KE')}"`,
        `"Currency: ${state.baseCurrency}"`,
        '',
        headers.map(header => `"${header}"`).join(','),
        ...data.map(row => 
          headers.map(header => {
            let value = row[header];
            
            // Format for Excel
            if (typeof value === 'number' && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('balance'))) {
              return value; // Keep as number for Excel calculations
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

  return {
    exportToCSV,
    exportToPDF,
    exportToExcel,
    exporting
  };
};