import React, { useState, useEffect } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalProducts: { value: 0, description: 'Low Stock' },
    inventoryValue: { value: 0, description: 'Total Amount' },
    todaysInward: { value: 0, description: 'items received' },
    todaysOutward: { value: 0, description: 'items dispatched' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, inventoryRes, inwardRes, dispatchRes] = await Promise.all([
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/inventory/total-value'),
          fetch('http://localhost:5000/api/inventory/today-inward'),
          fetch('http://localhost:5000/api/dispatch'),
        ]);

        const productsData = await productsRes.json();
        const inventoryValueData = await inventoryRes.json();
        const inwardData = await inwardRes.json();
        const dispatchData = await dispatchRes.json();

        const today = new Date().toISOString().split('T')[0];

        const todaysOutward = dispatchData.filter(item => {
          const dispatchDate = new Date(item.dispatchDate).toISOString().split('T')[0];
          return dispatchDate === today;
        });

        // Total products and low stock count
        const totalProductsCount = Array.isArray(productsData) ? productsData.length : 0;
        const lowStockCount = Array.isArray(productsData)
          ? productsData.filter(p => Number(p.reorderLevel) <= 5).length
          : 0;

        setStats({
          totalProducts: {
            value: totalProductsCount,
            description: `${lowStockCount} product${lowStockCount !== 1 ? 's' : ''} in Low Stock`,
          },
          inventoryValue: {
            value: inventoryValueData.totalValue || 0,
            description: 'Total Amount',
          },
          todaysInward: {
            value: inwardData.count || 0,
            description: 'items received',
          },
          todaysOutward: {
            value: todaysOutward.length,
            description: 'items dispatched',
          },
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString() : '0';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
      {/* Total Products */}
      <div style={{ background: 'linear-gradient(135deg, #FF6B35, #F7931E)', borderRadius: '12px', padding: '20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', color: '#fd7231' }}>
            <LayersIcon />
          </span>
          <span style={{ fontSize: '14px', opacity: '0.9' }}>Total Products</span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          {formatNumber(stats.totalProducts.value)}
        </div>
        <div style={{ fontSize: '12px', opacity: '0.8' }}>
          {stats.totalProducts.description}
        </div>
      </div>

      {/* Inventory Value */}
      <div style={{ background: 'linear-gradient(135deg, #2C3E50, #3498DB)', borderRadius: '12px', padding: '20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', color: '#2d4860' }}>
            <CurrencyRupeeIcon />
          </span>
          <span style={{ fontSize: '14px', opacity: '0.9' }}>Inventory Value</span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          ₹{formatNumber(stats.inventoryValue.value)}
        </div>
        <div style={{ fontSize: '12px', opacity: '0.8' }}>
          {stats.inventoryValue.description}
        </div>
      </div>

      {/* Today's Inward */}
      <div style={{ background: 'linear-gradient(135deg, #16A085, #2ECC71)', borderRadius: '12px', padding: '20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', color: '#16a185' }}>
            <TrendingUpIcon />
          </span>
          <span style={{ fontSize: '14px', opacity: '0.9' }}>Today's Inward</span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          {formatNumber(stats.todaysInward.value)}
        </div>
        <div style={{ fontSize: '12px', opacity: '0.8' }}>
          {stats.todaysInward.description}
        </div>
      </div>

      {/* Today's Outward */}
      <div style={{ background: 'linear-gradient(135deg, #8E44AD, #3F51B5)', borderRadius: '12px', padding: '20px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', color: '#8e44ad' }}>
            <TrendingDownIcon />
          </span>
          <span style={{ fontSize: '14px', opacity: '0.9' }}>Today's Outward</span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          {formatNumber(stats.todaysOutward.value)}
        </div>
        <div style={{ fontSize: '12px', opacity: '0.8' }}>
          {stats.todaysOutward.description}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
