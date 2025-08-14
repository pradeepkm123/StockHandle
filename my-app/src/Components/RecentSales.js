import React, { useEffect, useState } from 'react';

const RecentSales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dispatchRes, productRes] = await Promise.all([
          fetch('https://stockhandle.onrender.com/api/dispatch'),
          fetch('https://stockhandle.onrender.com/api/products')
        ]);

        const dispatchData = await dispatchRes.json();
        const productData = await productRes.json();

        const sorted = dispatchData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSales(sorted.slice(0, 5));
        setProducts(productData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const getProductImage = (modelNo) => {
    const product = products.find(p =>
      p.model?.trim().toLowerCase() === modelNo?.trim().toLowerCase()
    );
    console.log(`Product for modelNo "${modelNo}":`, product);
    return product?.productImage || '';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Recent Outward</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {sales.length === 0 ? (
          <div style={{ fontSize: '14px', color: '#888' }}>No recent outward records</div>
        ) : (
          sales.map((sale, index) => {
            const productImage = getProductImage(sale.modelNo);
            const imageUrl = productImage
              ? `https://stockhandle.onrender.com/uploads/${productImage}`
              : '/placeholder.png';

            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F0EFF0', paddingBottom: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={imageUrl}
                    alt={sale.modelNo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                    {sale.modelNo} - INV: {sale.invoiceNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(sale.createdAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    marginBottom: '2px'
                  }}>
                    ₹ {sale.price}
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '500' }}>
                    {sale.customerName}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentSales;
