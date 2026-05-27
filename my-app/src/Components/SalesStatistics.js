// components/SalesStatistics.js
import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const SalesStatistics = () => {
  const revenueData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 40 },
    { month: 'Sep', value: 50 },
    { month: 'Oct', value: 30 },
    { month: 'Nov', value: 35 },
    { month: 'Dec', value: 25 }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Sales Statistics</h3>
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>$12,189</span>
          <span style={{ fontSize: '12px', backgroundColor: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>+5.5%</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>Revenue</div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#dc3545' }}>$49,380.76</span>
          <span style={{ fontSize: '12px', backgroundColor: '#dc3545', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>-2.1%</span>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>Expenses</div>
      </div>
      <div style={{ height: '100px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <Bar dataKey="value" fill="#FF6B35" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesStatistics;
