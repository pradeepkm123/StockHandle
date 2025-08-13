// components/TopCustomers.js
import React from 'react';

const TopCustomers = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Top Customers</h3>
        <span style={{ fontSize: '12px', color: '#666' }}>View All</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {[
          { name: 'Carlos Carter', orders: '84 Orders', amount: '$8,964' },
          { name: 'Sam Garner', orders: '32 Orders', amount: '$18,995' },
          { name: 'Richard Wilson', orders: '26 Orders', amount: '$5,366' },
          { name: 'Mary Branson', orders: '38 Orders', amount: '$4,569' },
          { name: 'Anne Tremblay', orders: '14 Orders', amount: '$3,698' }
        ].map((customer, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f0f0f0',
              borderRadius: '50%'
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                {customer.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {customer.orders}
              </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {customer.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomers;
