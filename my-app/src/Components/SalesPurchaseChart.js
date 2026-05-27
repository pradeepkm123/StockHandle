import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const SalesPurchaseChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inwardRes, outwardRes] = await Promise.all([
          fetch('https://stockhandle.onrender.com/api/inventory'),
          fetch('https://stockhandle.onrender.com/api/dispatch'),
        ]);

        const inwardData = await inwardRes.json();
        const outwardData = await outwardRes.json();

        // Get last 7 days
        const last7Days = eachDayOfInterval({
          start: subDays(new Date(), 6),
          end: new Date(),
        });

        const dailyMap = {};

        last7Days.forEach(date => {
          const key = format(date, 'yyyy-MM-dd');
          dailyMap[key] = {
            name: format(date, 'MMM dd'),
            inward: 0,
            outward: 0,
          };
        });

        inwardData.forEach(item => {
          const date = format(new Date(item.createdAt), 'yyyy-MM-dd');
          const qty = Number(item.quantity) || 0;
          if (dailyMap[date]) {
            dailyMap[date].inward += qty;
          }
        });

        outwardData.forEach(item => {
          const date = format(new Date(item.dispatchDate), 'yyyy-MM-dd');
          const qty = Number(item.quantity) || 0;
          if (dailyMap[date]) {
            dailyMap[date].outward += qty;
          }
        });

        const finalData = Object.values(dailyMap);
        setSalesData(finalData);
      } catch (err) {
        console.error('Error fetching stock movement data:', err);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: 10, border: '1px solid #ccc',borderRadius:'10px' }}>
          <p style={{ margin: 0 }}>{label}</p>
          <p style={{ margin: 0, color: '#18a384' }}>
            Inward : {payload.find(p => p.dataKey === 'inward')?.value || 0}
          </p>
          <p style={{ margin: 0, color: '#FF6B35' }}>
            Outward : {payload.find(p => p.dataKey === 'outward')?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          backgroundColor:'#f8f8f8b8',
          padding:'10px',
          borderRadius:'3px'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          Stock Movement (Last 7 Days)
        </h3>
      </div>

      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="inward" fill="#18a384" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="inward" position="top" fill="#18a384" fontSize={12} />
            </Bar>
            <Bar dataKey="outward" fill="#FF6B35" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="outward" position="top" fill="#FF6B35" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesPurchaseChart;
