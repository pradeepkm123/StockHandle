import React, { useEffect, useState } from 'react';

const LowStockProducts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();

        const filtered = data.filter(
          product => Number(product.reorderLevel) <= 5
        );

        setLowStockProducts(filtered);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Low Stock Products</h3>
        <span style={{ fontSize: '12px', color: '#666', cursor: 'pointer' }}>View All</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px',borderBottom:'1px solid #f4f4f4' }}>
        {lowStockProducts.length === 0 ? (
          <div style={{ fontSize: '14px', color: '#888' }}>No low stock products</div>
        ) : (
          lowStockProducts.map((product, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgb(240 240 240)'
              }}>
                {product.productImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${product.productImage}`}
                    alt={product.model || 'Product'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                  {product.model || product.name || 'Unnamed'}
                </div>
                <div style={{ fontSize: '12px', color: '#e74c3c' }}>
                  {product.reorderLevel} in stock
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LowStockProducts;
