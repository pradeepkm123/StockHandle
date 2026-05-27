// components/TopCategories.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TopCategories = () => {
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#FF6B35' },
    { name: 'Fashion', value: 30, color: '#F7931E' },
    { name: 'Home', value: 20, color: '#FFD23F' },
    { name: 'Books', value: 15, color: '#4ECDC4' }
  ];

  const orderStats = [
    { day: 'Mon', orders: 30 },
    { day: 'Tue', orders: 45 },
    { day: 'Wed', orders: 35 },
    { day: 'Thu', orders: 50 },
    { day: 'Fri', orders: 40 },
    { day: 'Sat', orders: 55 },
    { day: 'Sun', orders: 25 }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Top Categories</h3>

      <div style={{ height: '120px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={45}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Category Statistics</h4>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
          • Total Number Of Categories: <strong>698</strong>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          • Total Number Of Products: <strong>7999</strong>
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600' }}>Order Statistics</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>698 <span style={{ color: '#666' }}>Sales</span></span>
            <span>16 min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>565 <span style={{ color: '#666' }}>Sales</span></span>
            <span>8 min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>545 <span style={{ color: '#666' }}>Sales</span></span>
            <span>12 min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>456 <span style={{ color: '#666' }}>Sales</span></span>
            <span>6 min</span>
          </div>
        </div>

        <div style={{ height: '80px', marginTop: '15px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderStats}>
              <Bar dataKey="orders" fill="#FF6B35" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
