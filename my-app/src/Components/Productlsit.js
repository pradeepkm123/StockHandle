import React, { useState, useRef } from 'react';
import {
  Camera, Video, Wifi, Radio, HardDrive, MonitorPlay,
  AlertTriangle, XCircle, ChevronLeft, ChevronRight,
  Battery, ToggleLeft, Network
} from 'lucide-react';
import NoProduct from '../assets/img/No-Product.png';

// ------------------- Stat Card -------------------
const StatCard = ({ icon: Icon, title, iconBg, count, onClick, isSelected, stats }) => {
  const styles = {
    card: {
      backgroundColor: isSelected ? '#4F46E5' : '#FFFFFF',
      borderRadius: '12px',
      padding: '16px',
      minWidth: '130px',
      flex: 1,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: isSelected ? '2px solid #4F46E5' : '2px solid #E5E7EB',
    },
    iconContainer: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      backgroundColor: isSelected ? '#FFFFFF' : iconBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
    },
    title: {
      fontSize: '13px',
      color: isSelected ? '#FFFFFF' : '#1F2937',
      fontWeight: '600',
      marginBottom: '6px',
    },
    count: {
      fontSize: '20px',
      fontWeight: '700',
      color: isSelected ? '#FFFFFF' : '#4F46E5',
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
    },
    statItem: {
      fontSize: '12px',
      color: isSelected ? '#FFFFFF' : '#6B7280',
    },
  };

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={styles.iconContainer}>
        <Icon size={24} color={isSelected ? '#4F46E5' : '#4F46E5'} strokeWidth={2.5} />
      </div>
      <div style={styles.title}>{title}</div>
      <div style={styles.count}>{count}</div>
      <div style={styles.statsContainer}>
        <div style={styles.statItem}>In Stock: {stats.inStock}</div>
        <div style={styles.statItem}>Low: {stats.lowStock}</div>
        <div style={styles.statItem}>Out: {stats.outOfStock}</div>
      </div>
    </div>
  );
};

// ------------------- Product Cards -------------------
const ProductCards = ({ products, category }) => {
  const styles = {
    container: {
      marginTop: '24px',
    },
    header: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '2px solid #E5E7EB',
      transition: 'all 0.3s',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    modelNo: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '4px',
    },
    productName: {
      fontSize: '13px',
      color: '#6B7280',
      lineHeight: '1.4',
    },
    statusBadge: (status) => ({
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: status === 'Out of Stock' ? '#FEE2E2' : '#FEF3C7',
      color: status === 'Out of Stock' ? '#DC2626' : '#D97706',
    }),
    quantitySection: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    quantityLabel: {
      fontSize: '12px',
      color: '#6B7280',
      fontWeight: '500',
    },
    quantityValue: (qty) => ({
      fontSize: '18px',
      fontWeight: '700',
      color: qty === 0 ? '#DC2626' : '#D97706',
    }),
  };

  const filteredProducts = category === 'ALL'
    ? products
    : products.filter(p => p.category === category);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Stock Status - {category === 'ALL' ? 'All Products' : category}</h2>
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
          <img
            src={NoProduct}
            alt="No products found"
            style={{ width: '100px', marginBottom: '16px' }}
          />
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#4F46E5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.modelNo}>{product.model || 'No Model'}</div>
                  <div style={styles.productName}>{product.brand || 'No Brand'}</div>
                </div>
                <span style={styles.statusBadge(product.stockStatus)}>
                  {product.stockStatus === 'Out of Stock' ? (
                    <XCircle size={14} />
                  ) : (
                    <AlertTriangle size={14} />
                  )}
                  {product.stockStatus}
                </span>
              </div>
              <div style={styles.quantitySection}>
                <span style={styles.quantityLabel}>Stock Quantity</span>
                <span style={styles.quantityValue(product.reorderLevel)}>{product.reorderLevel ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------- Main Productlist -------------------
export default function Productlist({ setSelectedCategory, products }) {
  const [selectedCategory, setSelectedCategoryLocal] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleCategorySelect = (category) => {
    const categoryMapping = {
      'All Products': 'ALL',
      'PTZ Camera': 'PTZ',
      'HD Camera': 'HD CAMERA',
      'IP Camera': 'IP CAMERA',
      'Power supply': 'POWER SUPPLY',
      'WiFi Camera': 'WiFi Camera',
      '4G Camera': '4G Camera',
      'CCTV Camera': 'CCTV Camera',
      'NVR': 'NVR',
      'DVR': 'DVR',
      'XVR': 'XVR',
      'Switch': 'SWITCH',
      'POE Switch': 'POE Switch'
    };

    const mappedCategory = categoryMapping[category] || category;
    setSelectedCategoryLocal(category);
    setSelectedCategory(mappedCategory === 'ALL' ? null : mappedCategory);
  };

  // Calculate category counts and stock status
  const categoryCounts = {};
  const categoryStats = {};
  products.forEach((product) => {
    const cat = product.category || 'Uncategorized';
    if (!categoryCounts[cat]) categoryCounts[cat] = 0;
    categoryCounts[cat] += 1;

    if (!categoryStats[cat]) {
      categoryStats[cat] = { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
    }
    categoryStats[cat].total += 1;
    if (product.stockStatus === 'In Stock') categoryStats[cat].inStock += 1;
    else if (product.stockStatus === 'Low Stock') categoryStats[cat].lowStock += 1;
    else if (product.stockStatus === 'Out of Stock') categoryStats[cat].outOfStock += 1;
  });

  const categories = [
    { name: 'All Products', icon: Camera, iconBg: '#EEF2FF', count: products.length, stats: { total: products.length, inStock: products.filter(p => p.stockStatus === 'In Stock').length, lowStock: products.filter(p => p.stockStatus === 'Low Stock').length, outOfStock: products.filter(p => p.stockStatus === 'Out of Stock').length } },
    { name: 'CCTV Camera', icon: Camera, iconBg: '#EEF2FF', count: categoryCounts['CCTV Camera'] || 0, stats: categoryStats['CCTV Camera'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'HD Camera', icon: Video, iconBg: '#FEF3C7', count: categoryCounts['HD CAMERA'] || 0, stats: categoryStats['HD CAMERA'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'IP Camera', icon: MonitorPlay, iconBg: '#D1FAE5', count: categoryCounts['IP CAMERA'] || 0, stats: categoryStats['IP CAMERA'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'PTZ Camera', icon: Radio, iconBg: '#FCE7F3', count: categoryCounts['PTZ'] || 0, stats: categoryStats['PTZ'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'WiFi Camera', icon: Wifi, iconBg: '#E0E7FF', count: categoryCounts['WiFi Camera'] || 0, stats: categoryStats['WiFi Camera'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: '4G Camera', icon: Camera, iconBg: '#D1FAE5', count: categoryCounts['4G Camera'] || 0, stats: categoryStats['4G Camera'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'DVR', icon: HardDrive, iconBg: '#DBEAFE', count: categoryCounts['DVR'] || 0, stats: categoryStats['DVR'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'NVR', icon: HardDrive, iconBg: '#F3E8FF', count: categoryCounts['NVR'] || 0, stats: categoryStats['NVR'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'XVR', icon: MonitorPlay, iconBg: '#F3E8FF', count: categoryCounts['XVR'] || 0, stats: categoryStats['XVR'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'Power supply', icon: Battery, iconBg: '#FEF3C7', count: categoryCounts['POWER SUPPLY'] || 0, stats: categoryStats['POWER SUPPLY'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'Switch', icon: ToggleLeft, iconBg: '#EEF2FF', count: categoryCounts['SWITCH'] || 0, stats: categoryStats['SWITCH'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
    { name: 'POE Switch', icon: Network, iconBg: '#D1FAE5', count: categoryCounts['POE Switch'] || 0, stats: categoryStats['POE Switch'] || { total: 0, inStock: 0, lowStock: 0, outOfStock: 0 } },
  ];

  const styles = {
    container: {
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#F3F4F6',
      maxWidth: '100%',
      overflowX: 'hidden',
      borderRadius: '15px',
      marginTop: '25px'
    },
    header: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '24px',
    },
    scrollWrapper: {
      position: 'relative',
      marginBottom: '20px',
    },
    scrollContainer: {
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      scrollBehavior: 'smooth',
      paddingBottom: '10px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    scrollButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#FFFFFF',
      border: '2px solid #D1D5DB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 10,
      transition: 'all 0.3s',
    },
    leftButton: {
      left: '5px',
    },
    rightButton: {
      right: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>List of Category</h1>
      <div style={styles.scrollWrapper}>
        <button
          style={{ ...styles.scrollButton, ...styles.leftButton }}
          onClick={() => scroll('left')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
            e.currentTarget.style.borderColor = '#4F46E5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#D1D5DB';
          }}
        >
          <ChevronLeft size={20} color="#1F2937" />
        </button>
        <div
          ref={scrollContainerRef}
          style={styles.scrollContainer}
        >
          {categories.map((category) => (
            <div key={category.name} style={{ minWidth: '140px' }}>
              <StatCard
                icon={category.icon}
                title={category.name}
                iconBg={category.iconBg}
                count={category.count}
                stats={category.stats}
                onClick={() => handleCategorySelect(category.name)}
                isSelected={selectedCategory === category.name}
              />
            </div>
          ))}
        </div>
        <button
          style={{ ...styles.scrollButton, ...styles.rightButton }}
          onClick={() => scroll('right')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
            e.currentTarget.style.borderColor = '#4F46E5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#D1D5DB';
          }}
        >
          <ChevronRight size={20} color="#1F2937" />
        </button>
      </div>

      {selectedCategory && (
        <ProductCards
          products={products}
          category={
            selectedCategory === 'All Products' ? 'ALL' :
              ({
                'PTZ Camera': 'PTZ',
                'HD Camera': 'HD CAMERA',
                'IP Camera': 'IP CAMERA',
                'Power supply': 'POWER SUPPLY',
                'Switch': 'SWITCH',
                'POE Switch': 'POE Switch',
                'WiFi Camera': 'WiFi Camera',
                '4G Camera': '4G Camera',
                'CCTV Camera': 'CCTV Camera'
              }[selectedCategory] || selectedCategory)
          }
        />
      )}
    </div>
  );
}
