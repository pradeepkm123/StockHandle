// components/TopSellingProducts.js
import React from 'react';

const TopSellingProducts = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Top Selling Products</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {[
          { name: 'Charger Cable - Lightning', sales: '2,777 Sales', color: '#FF6B35' },
          { name: 'Yves Saint Eau De Parfum', sales: '1,234 Sales', color: '#E91E63' },
          { name: 'Apple AirPods 2', sales: '1,456 Sales', color: '#2E7D32' },
          { name: 'Vacuum Cleaner', sales: '2,341 Sales', color: '#1976D2' },
          { name: 'Samsung Galaxy S21 Fe 5g', sales: '3,456 Sales', color: '#7B1FA2' }
        ].map((product, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: product.color,
              borderRadius: '8px'
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                {product.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {product.sales}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
