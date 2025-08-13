import React, { useEffect, useState } from 'react';

const RecentTransactions = () => {
  const [inwardData, setInwardData] = useState([]);

  useEffect(() => {
    const fetchInward = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory');
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInwardData(sorted.slice(0, 5)); // Latest 5
      } catch (err) {
        console.error('Error fetching inward data:', err);
      }
    };

    fetchInward();
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
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Inwards</h3>
        <span style={{ fontSize: '12px', color: '#666' }}>View All</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {inwardData.length === 0 ? (
          <div style={{ fontSize: '14px', color: '#888' }}>No records</div>
        ) : (
          inwardData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px',borderBottom:'1px solid #f0f0f0',paddingBottom:'10px' }}>
              {/* <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
                overflow: 'hidden'
              }}>
                {item.productImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.productImage}`}
                    alt={item.modelNo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div> */}

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.modelNo}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{item.location}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#606060' }}>
                  Quantity: {item.quantity}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#28a745',
                  backgroundColor: '#d4edda',
                  padding: '1px 23px',
                  borderRadius: '8px'
                }}>
                  ₹ {item.dealerPrice ?? 0}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
