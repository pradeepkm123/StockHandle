// import React, { useState, useEffect } from 'react';
// import { useUser } from './UserContext';
// import {
//     Box,
//     Typography,
//     Grid,
//     Paper,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Chip
// } from '@mui/material';

// import {
//     Inventory,
//     Videocam,
//     SettingsInputComponent,
//     Dns,
//     Router,
//     SdStorage,
//     CameraAlt,
//     Storefront as StoreIcon
// } from '@mui/icons-material';

// import axios from 'axios';

// const API_BASE = 'https://stockhandle.onrender.com/api';

// const StoreHome = ({ onStoreSelect }) => {
//     const { user } = useUser();

//     const [stats, setStats] = useState({
//         totalItems: 0,
//         lowStock: 0,
//         products: 0,
//         outOfStock: 0,
//     });
//     const [loading, setLoading] = useState(true);
//     const [categoryStats, setCategoryStats] = useState([]);
//     const [transactions, setTransactions] = useState([]);
//     const [selectedOwner, setSelectedOwner] = useState(null);
//     const [selectedCategory, setSelectedCategory] = useState(null);

//     useEffect(() => {
//         if (user?.role === 'CCTV Shoppee Avadi') {
//             document.title = `${user.role} | Lookman`;
//         }
//     }, [user?.role]);

//     useEffect(() => {
//         const fetchStoreData = async () => {
//             if (user?.role !== 'CCTV Shoppee Avadi') return;
//             try {
//                 setLoading(true);
//                 const [inwardRes, dispatchRes] = await Promise.all([
//                     axios.get(`${API_BASE}/store-inward`),
//                     axios.get(`${API_BASE}/dispatch`)
//                 ]);

//                 const inwardData = inwardRes.data?.movements || inwardRes.data || [];
//                 const dispatchData = dispatchRes.data || [];

//                 const processedInward = inwardData.map(item => ({ ...item, type: 'inward', activity: 'STORE INWARD' }));
//                 const processedDispatch = dispatchData.map(item => ({ ...item, type: 'dispatch', activity: 'DISPATCH' }));

//                 const combinedData = [...processedInward, ...processedDispatch];

//                 const avadiStores = ['cctv shoppee avadi', 'lookman cctv avadi', 'lookman cctv avadi.'];
//                 const storeData = combinedData.filter(item => {
//                     const store = (item.storeName || item.toStore || '').toLowerCase();
//                     return avadiStores.some(s => store.includes(s)) || store.includes('avadi');
//                 });

//                 storeData.sort((a, b) => new Date(b.createdAt || b.dispatchDate) - new Date(a.createdAt || a.dispatchDate));

//                 setTransactions(storeData);
//             } catch (error) {
//                 console.error("Error fetching store data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user?.role) {
//             fetchStoreData();
//         }
//     }, [user?.role]);

//     useEffect(() => {
//         if (!transactions.length) return;

//         const filteredData = selectedOwner
//             ? transactions.filter(item => {
//                 const store = (item.storeName || item.toStore || '').toLowerCase();
//                 const owner = (item.owner || '').toLowerCase();
//                 if (selectedOwner === 'CCTV Shoppee') return owner.includes('cctv shoppee');
//                 if (selectedOwner === 'Lookman') return store.includes('lookman') || owner.includes('lookman');
//                 return false;
//             })
//             : transactions;

//         const catStats = {};
//         const initCat = (name) => {
//             if (!catStats[name]) {
//                 catStats[name] = { name, totalQuantity: 0 };
//             }
//         };

//         const categories = [
//             'hd (non-color)', 'hd (color)', 'dvr', 'xvr',
//             'ip (non-color)', 'ip (color)', 'nvr', 'ptz', 'anpr camera'
//         ];
//         categories.forEach(initCat);

//         filteredData.forEach(item => {
//             const qty = Number(item.quantity) || 0;
//             const itemCat = item.category?.trim().toLowerCase();
//             const itemSubCat = item.subCategory?.trim().toLowerCase() || '';

//             if (itemCat === 'hd camera') {
//                 if (itemSubCat.includes('color') && !itemSubCat.includes('non')) {
//                     catStats['hd (color)'].totalQuantity += qty;
//                 } else if (itemSubCat.includes('non-color') || itemSubCat.includes('non color')) {
//                     catStats['hd (non-color)'].totalQuantity += qty;
//                 }
//             } else if (itemCat === 'ip camera') {
//                 if (itemSubCat.includes('color') && !itemSubCat.includes('non')) {
//                     catStats['ip (color)'].totalQuantity += qty;
//                 } else if (itemSubCat.includes('non-color') || itemSubCat.includes('non color')) {
//                     catStats['ip (non-color)'].totalQuantity += qty;
//                 }
//             } else if (catStats[itemCat]) {
//                 catStats[itemCat].totalQuantity += qty;
//             }
//         });

//         setCategoryStats(Object.values(catStats));
//     }, [transactions, selectedOwner]);

//     const handleOwnerSelect = (owner) => {
//         setSelectedOwner(owner);
//         setSelectedCategory(null);
//         if (onStoreSelect) onStoreSelect(owner);
//     };

//     const handleCategorySelect = (categoryName) => {
//         setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
//     };

//     if (user?.role !== 'CCTV Shoppee Avadi') return null;

//     return (
//         <Box sx={{
//             backgroundColor: '#f8fafc',
//             minHeight: '100vh',
//             pt: 4,
//             pb: 8,
//             px: 6
//         }}>
//             <Box sx={{ maxWidth: '3500px', margin: '0 auto' }}>
//                 {/* Owner Selection Grid */}
//                 <Grid container spacing={3} sx={{ mb: 6 }}>
//                     {[
//                         { name: 'CCTV Shoppee', title: 'CCTV SHOPPEE', color: '#3b82f6', bg: '#eff6ff' },
//                         { name: 'Lookman', title: 'LOOKMAN', color: '#10b981', bg: '#f0fdf4' }
//                     ].map((owner) => (
//                         <Grid item xs={12} md={6} key={owner.name} style={{ marginTop: '20px', width: '49%' }}>
//                             <Paper
//                                 onClick={() => handleOwnerSelect(owner.name)}
//                                 sx={{
//                                     p: 4,
//                                     borderRadius: '16px',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                     border: '1px solid',
//                                     borderColor: selectedOwner === owner.name ? owner.color : 'transparent',
//                                     boxShadow: selectedOwner === owner.name ? `0 10px 20px -5px ${owner.color}20` : '0 4px 6px -1px rgba(0,0,0,0.05)',
//                                     backgroundColor: 'white',
//                                     '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)' }
//                                 }}
//                             >
//                                 <Box sx={{
//                                     backgroundColor: owner.bg,
//                                     color: owner.color,
//                                     width: '42px',
//                                     height: '42px',
//                                     borderRadius: '10px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     mb: 1.5
//                                 }}>
//                                     <Inventory sx={{ fontSize: '20px' }} />
//                                 </Box>
//                                 <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>{owner.title}</Typography>
//                                 <Typography variant="caption" sx={{ color: '#64748b', mb: 0.7, display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}>(AVADI)</Typography>
//                                 <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
//                                     {owner.name === 'Lookman' ? 'Lookman Branch' : 'Main Store'} Inventory Management
//                                 </Typography>
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>

//                 {/* Stock Details Section Container */}
//                 <Box sx={{ mb: 6 }}>
//                     <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
//                         Stock Details ({selectedOwner ? `${selectedOwner} Avadi` : 'Overall Avadi'})
//                     </Typography>

//                     <Paper sx={{
//                         p: 3,
//                         borderRadius: '16px',
//                         backgroundColor: '#f3f8fb', // Light blue-gray background as seen in image
//                         border: '1px solid #e2e8f0',
//                         boxShadow: 'none'
//                     }}>
//                         {/* Row 1: 4 items */}
//                         <Grid container spacing={2} style={{ gap: '51px', marginBottom: '30px' }}>
//                             {[
//                                 { label: 'HD (NON-COLOR)', key: 'hd (non-color)', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#64748b' },
//                                 { label: 'HD (COLOR)', key: 'hd (color)', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#64748b' },
//                                 { label: 'DVR', key: 'dvr', icon: <SdStorage sx={{ fontSize: '25px' }} />, color: '#10b981' },
//                                 { label: 'XVR', key: 'xvr', icon: <SettingsInputComponent sx={{ fontSize: '25px' }} />, color: '#f59e0b' },
//                             ].map((item, idx) => (
//                                 <Grid item key={idx} style={{ flex: 1 }}>
//                                     <Paper
//                                         onClick={() => handleCategorySelect(item.key)}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: '12px',
//                                             cursor: 'pointer',
//                                             transition: 'all 0.2s',
//                                             border: '1px solid #eef2f6',
//                                             backgroundColor: selectedCategory === item.key ? '#edf2f7' : '#fbfcff',
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//                                             '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
//                                         }}
//                                     >
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
//                                             <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
//                                             <Typography variant="caption" sx={{ fontWeight: 700, color: '#3e3e3eff', fontSize: '1rem', letterSpacing: '0.02em' }}>
//                                                 {item.label}
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '2.5rem' }}>
//                                             {categoryStats.find(c => c.name === item.key)?.totalQuantity || 0}
//                                         </Typography>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>

//                         {/* Row 2: 5 items */}
//                         <Grid container spacing={2} style={{ gap: '20px' }}>
//                             {[
//                                 { label: 'IP (NON-COLOR)', key: 'ip (non-color)', icon: <Router sx={{ fontSize: '25px' }} />, color: '#3b82f6' },
//                                 { label: 'IP (COLOR)', key: 'ip (color)', icon: <Router sx={{ fontSize: '25px' }} />, color: '#3b82f6' },
//                                 { label: 'NVR', key: 'nvr', icon: <Dns sx={{ fontSize: '25px' }} />, color: '#06b6d4' },
//                                 { label: 'PTZ', key: 'ptz', icon: <Videocam sx={{ fontSize: '25px' }} />, color: '#ec4899' },
//                                 { label: 'ANPR', key: 'anpr camera', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#06b6d4' },
//                             ].map((item, idx) => (
//                                 <Grid item key={idx} style={{ flex: 1 }}>
//                                     <Paper
//                                         onClick={() => handleCategorySelect(item.key)}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: '12px',
//                                             cursor: 'pointer',
//                                             transition: 'all 0.2s',
//                                             border: '1px solid #eef2f6',
//                                             backgroundColor: selectedCategory === item.key ? '#edf2f7' : '#fbfcff',
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//                                             '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
//                                         }}
//                                     >
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
//                                             <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
//                                             <Typography variant="caption" sx={{ fontWeight: 700, color: '#3e3e3eff', fontSize: '1rem', letterSpacing: '0.02em' }}>
//                                                 {item.label}
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '2.5rem' }}>
//                                             {categoryStats.find(c => c.name === item.key)?.totalQuantity || 0}
//                                         </Typography>
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Paper>
//                 </Box>


//             </Box>
//         </Box>
//     );
// };

// export default StoreHome;







import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import {
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

import {
  Inventory,
  Videocam,
  SettingsInputComponent,
  Dns,
  Router,
  SdStorage,
  CameraAlt,
} from '@mui/icons-material';

import axios from 'axios';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

const StoreHome = ({ onStoreSelect }) => {
  const { user } = useUser();

  const [categoryStats, setCategoryStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (user?.role === 'CCTV Shoppee Avadi') {
      document.title = `${user.role} | Lookman`;
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!user?.role) return;

      try {
        const [inwardRes, dispatchRes] = await Promise.all([
          axios.get(`${API_BASE}/store-inward`),
          axios.get(`${API_BASE}/dispatch`)
        ]);

        const inwardData = inwardRes.data?.movements || inwardRes.data || [];
        const dispatchData = dispatchRes.data || [];

        const processedInward = inwardData.map((item) => ({
          ...item,
          type: 'inward',
          activity: 'STORE INWARD',
        }));

        const processedDispatch = dispatchData.map((item) => ({
          ...item,
          type: 'dispatch',
          activity: 'DISPATCH',
        }));

        const combinedData = [...processedInward, ...processedDispatch];

        let storeData = [];
        if (user.role === 'CCTV Shoppee Avadi') {
          const avadiStores = ['cctv shoppee avadi', 'lookman cctv avadi', 'lookman cctv avadi.'];
          storeData = combinedData.filter((item) => {
            const store = (item.storeName || item.toStore || '').toLowerCase();
            return avadiStores.some((s) => store.includes(s)) || store.includes('avadi');
          });
        } else {
          storeData = combinedData.filter((item) => {
            const store = (item.storeName || item.toStore || '').toLowerCase();
            return store === user.role.toLowerCase();
          });
        }

        storeData.sort(
          (a, b) =>
            new Date(b.createdAt || b.dispatchDate) - new Date(a.createdAt || a.dispatchDate)
        );

        setTransactions(storeData);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    if (user?.role) {
      fetchStoreData();
    }
  }, [user?.role]);

  useEffect(() => {
    if (!transactions.length) return;

    const filteredData = selectedOwner
      ? transactions.filter((item) => {
          const store = (item.storeName || item.toStore || '').toLowerCase();
          const owner = (item.owner || '').toLowerCase();

          if (selectedOwner === 'CCTV Shoppee') return owner.includes('cctv shoppee');
          if (selectedOwner === 'Lookman') return store.includes('lookman') || owner.includes('lookman');
          return false;
        })
      : transactions;

    const catStats = {};
    const initCat = (name) => {
      if (!catStats[name]) catStats[name] = { name, totalQuantity: 0 };
    };

    const categories = [
      'hd (non-color)',
      'hd (color)',
      'dvr',
      'xvr',
      'ip (non-color)',
      'ip (color)',
      'nvr',
      'ptz',
      'anpr camera',
    ];
    categories.forEach(initCat);

    filteredData.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const itemCat = item.category?.trim().toLowerCase();
      const itemSubCat = item.subCategory?.trim().toLowerCase() || '';

      if (itemCat === 'hd camera') {
        if (itemSubCat.includes('color') && !itemSubCat.includes('non')) {
          catStats['hd (color)'].totalQuantity += qty;
        } else if (itemSubCat.includes('non-color') || itemSubCat.includes('non color')) {
          catStats['hd (non-color)'].totalQuantity += qty;
        }
      } else if (itemCat === 'ip camera') {
        if (itemSubCat.includes('color') && !itemSubCat.includes('non')) {
          catStats['ip (color)'].totalQuantity += qty;
        } else if (itemSubCat.includes('non-color') || itemSubCat.includes('non color')) {
          catStats['ip (non-color)'].totalQuantity += qty;
        }
      } else if (itemCat && catStats[itemCat]) {
        catStats[itemCat].totalQuantity += qty;
      }
    });

    setCategoryStats(Object.values(catStats));
  }, [transactions, selectedOwner]);

  const handleOwnerSelect = (owner) => {
    setSelectedOwner(owner);
    setSelectedCategory(null);
    if (onStoreSelect) onStoreSelect(owner);
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };


  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        pt: 4,
        pb: 8,
        px: 6,
      }}
    >
      <Box sx={{ maxWidth: '3500px', margin: '0 auto' }}>
        {/* Owner Selection Grid */}
        {user?.role === 'CCTV Shoppee Avadi' && (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { name: 'CCTV Shoppee', title: 'CCTV SHOPPEE', color: '#3b82f6', bg: '#eff6ff' },
              { name: 'Lookman', title: 'LOOKMAN', color: '#10b981', bg: '#f0fdf4' },
            ].map((owner) => (
              <Grid item xs={12} md={6} key={owner.name} style={{ marginTop: '20px', width: '49%' }}>
                <Paper
                  onClick={() => handleOwnerSelect(owner.name)}
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: selectedOwner === owner.name ? owner.color : 'transparent',
                    boxShadow:
                      selectedOwner === owner.name
                        ? `0 10px 20px -5px ${owner.color}20`
                        : '0 4px 6px -1px rgba(0,0,0,0.05)',
                    backgroundColor: 'white',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: owner.bg,
                      color: owner.color,
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Inventory sx={{ fontSize: '20px' }} />
                  </Box>
  
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                    {owner.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      mb: 0.7,
                      display: 'block',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    (AVADI)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {owner.name === 'Lookman' ? 'Lookman Branch' : 'Main Store'} Inventory Management
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Stock Details */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
            Stock Details ({user?.role === 'CCTV Shoppee Avadi' ? (selectedOwner ? `${selectedOwner} Avadi` : 'Overall Avadi') : `Overall ${user?.role}`})
          </Typography>

          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: '#f3f8fb',
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
            }}
          >
            {/* Row 1 */}
            <Grid container spacing={2} style={{ gap: '51px', marginBottom: '30px' }}>
              {[
                { label: 'HD (NON-COLOR)', key: 'hd (non-color)', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#64748b' },
                { label: 'HD (COLOR)', key: 'hd (color)', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#64748b' },
                { label: 'DVR', key: 'dvr', icon: <SdStorage sx={{ fontSize: '25px' }} />, color: '#10b981' },
                { label: 'XVR', key: 'xvr', icon: <SettingsInputComponent sx={{ fontSize: '25px' }} />, color: '#f59e0b' },
              ].map((item, idx) => (
                <Grid item key={idx} style={{ flex: 1 }}>
                  <Paper
                    onClick={() => handleCategorySelect(item.key)}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #eef2f6',
                      backgroundColor: selectedCategory === item.key ? '#edf2f7' : '#fbfcff',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                      <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: '#3e3e3eff', fontSize: '1rem', letterSpacing: '0.02em' }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '2.5rem' }}>
                      {categoryStats.find((c) => c.name === item.key)?.totalQuantity || 0}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Row 2 */}
            <Grid container spacing={2} style={{ gap: '20px' }}>
              {[
                { label: 'IP (NON-COLOR)', key: 'ip (non-color)', icon: <Router sx={{ fontSize: '25px' }} />, color: '#3b82f6' },
                { label: 'IP (COLOR)', key: 'ip (color)', icon: <Router sx={{ fontSize: '25px' }} />, color: '#3b82f6' },
                { label: 'NVR', key: 'nvr', icon: <Dns sx={{ fontSize: '25px' }} />, color: '#06b6d4' },
                { label: 'PTZ', key: 'ptz', icon: <Videocam sx={{ fontSize: '25px' }} />, color: '#ec4899' },
                { label: 'ANPR', key: 'anpr camera', icon: <CameraAlt sx={{ fontSize: '25px' }} />, color: '#06b6d4' },
              ].map((item, idx) => (
                <Grid item key={idx} style={{ flex: 1 }}>
                  <Paper
                    onClick={() => handleCategorySelect(item.key)}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #eef2f6',
                      backgroundColor: selectedCategory === item.key ? '#edf2f7' : '#fbfcff',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                      <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: '#3e3e3eff', fontSize: '1rem', letterSpacing: '0.02em' }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '2.5rem' }}>
                      {categoryStats.find((c) => c.name === item.key)?.totalQuantity || 0}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default StoreHome;
