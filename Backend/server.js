// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const fs = require('fs');

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// app.use('/uploads', express.static(uploadDir)); // ✅ serve image files

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Middlewares
// app.use(cors());
// app.use(express.json()); // Replaces deprecated bodyParser.json()
// app.use('/uploads', express.static(uploadDir)); // Serve uploaded images

// const authRoutes = require('./routes/authRoutes');
// const warehouseRoutes = require('./routes/warehouseRoutes');
// const brandRoutes = require('./routes/brandRoutes');
// const locationRoutes = require('./routes/locationRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const subCategoryRoutes = require('./routes/subCategoryRoutes');
// const productRoutes = require('./routes/productRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const salesPersonRoutes = require('./routes/salesPersonRoutes');
// const dispatchRoutes = require('./routes/dispatchRoutes');
// const statsRoutes = require('./routes/statsRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const userRoutes = require('./routes/userRoutes');
// const stockOutwardRoutes = require('./routes/stockOutwardRoutes');
// const storeInwardRoutes = require('./routes/storeInwardRoutes');
// const storeCustomerRoutes = require('./routes/storeCustomerRoutes');
// const packagingRoutes = require('./routes/packagingRoutes');
// const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
// // const itemRoutes = require('./routes/itemRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');



// app.use('/api/stock-outward', stockOutwardRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/warehouses', warehouseRoutes);
// app.use('/api/brands', brandRoutes);
// app.use('/api/locations', locationRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/subcategories', subCategoryRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/salesPersons', salesPersonRoutes);
// app.use('/api/dispatch', dispatchRoutes);
// app.use('/api', statsRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/store-inward', storeInwardRoutes);
// app.use('/api/storecustomers', storeCustomerRoutes);  
// app.use('/api/packaging', packagingRoutes);
// app.use('/api/raw-materials', rawMaterialRoutes);
// // app.use('/api/items', itemRoutes);
// app.use('/api', serviceRoutes);


// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err.stack);
//   res.status(500).json({ error: 'Something went wrong on the server.' });
// });

// // MongoDB Connection
// const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('✅ Connected to MongoDB');

//   // Start Server after DB connects
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// })
// .catch(err => {
//   console.error('❌ MongoDB connection failed:', err.message);
// });










const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir)); // ✅ serve image files

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middlewares
app.use(cors());
app.use(express.json()); // Replaces deprecated bodyParser.json()
app.use('/uploads', express.static(uploadDir)); // Serve uploaded images

const authRoutes = require('./routes/authRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const brandRoutes = require('./routes/brandRoutes');
const locationRoutes = require('./routes/locationRoutes');
const customerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const salesPersonRoutes = require('./routes/salesPersonRoutes');
const dispatchRoutes = require('./routes/dispatchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const stockOutwardRoutes = require('./routes/stockOutwardRoutes');
const storesOutwardRoutes = require('./routes/storesOutwardRoutes');
const storeInwardRoutes = require('./routes/storeInwardRoutes');
const storeCustomerRoutes = require('./routes/storeCustomerRoutes');
const packagingRoutes = require('./routes/packagingRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
// const itemRoutes = require('./routes/itemRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const selfTransferRoutes = require('./routes/selfTransferRoutes');




app.use('/api/stock-outward', stockOutwardRoutes);
app.use('/api/stores-outward', storesOutwardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/salesPersons', salesPersonRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api', statsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/store-inward', storeInwardRoutes);
app.use('/api/storecustomers', storeCustomerRoutes);
app.use('/api/packaging', packagingRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
// app.use('/api/items', itemRoutes);
app.use('/api', serviceRoutes);

app.use('/api/self-transfer', selfTransferRoutes);



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start Server after DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });





