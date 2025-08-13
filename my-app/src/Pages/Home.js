import React from 'react';
import Header from '../Components/Header';
import AlertBanner from '../Components/AlertBanner';
import StatsCards from '../Components/StatsCards';
import SalesPurchaseChart from '../Components/SalesPurchaseChart';
import OverallInformation from '../Components/OverallInformation';
import TopSellingProducts from '../Components/TopSellingProducts';
import LowStockProducts from '../Components/LowStockProducts';
import RecentSales from '../Components/RecentSales';
import SalesStatistics from '../Components/SalesStatistics';
import RecentTransactions from '../Components/RecentTransactions';
import TopCustomers from '../Components/TopCustomers';
import TopCategories from '../Components/TopCategories';

const Dashboard = () => {
  const salesData = [
    { name: '1 Jan', sales: 80, purchase: 40 },
    { name: '4 Jan', sales: 90, purchase: 35 },
    { name: '8 Jan', sales: 70, purchase: 30 },
    { name: '8 Jan', sales: 85, purchase: 45 },
    { name: '10 Jan', sales: 95, purchase: 50 },
    { name: '12 Jan', sales: 85, purchase: 40 },
    { name: '14 Jan', sales: 75, purchase: 35 },
    { name: '16 Jan', sales: 80, purchase: 40 },
    { name: '18 Jan', sales: 100, purchase: 55 },
    { name: '20 Jan', sales: 90, purchase: 45 },
    { name: '22 Jan', sales: 85, purchase: 40 },
    { name: '24 Jan', sales: 75, purchase: 35 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#FF6B35' },
    { name: 'Fashion', value: 30, color: '#F7931E' },
    { name: 'Home', value: 20, color: '#FFD23F' },
    { name: 'Books', value: 15, color: '#4ECDC4' }
  ];

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
  };

  return (
    <div style={styles.container}>
      {/* <Header /> */}
      {/* <AlertBanner /> */}
      <StatsCards />
      <div style={styles.twoColumnGrid}>
        <SalesPurchaseChart salesData={salesData} />
        <OverallInformation categoryData={categoryData} />
      </div>
      <div style={styles.gridContainer}>
        <RecentTransactions />
        <LowStockProducts />
        <RecentSales />
      </div>
      {/* <div style={styles.gridContainer}>
        <SalesStatistics />
        <TopSellingProducts />
        <TopCustomers />
        <TopCategories />
      </div> */}
    </div>
  );
};

export default Dashboard;
