const StoreInward = require('../models/StoreInward');
const StockOutward = require('../models/StockOutward');
const Product = require('../models/Product');

// ➕ Create Store Inward
exports.createStoreInward = async (req, res) => {
  try {
    const {
      modelNo,
      quantity,
      scanningCode,
      scannedBarcode,
      userId,
      storeName,
      brand,
      dealerPrice,
      mrp,
      model,
      subCategory,
      category,
      currentStock,
      pricePerUnit,
      salePerson,
      owner,
    } = req.body;

    if (!modelNo || !quantity || !storeName) {
      return res.status(400).json({ success: false, error: 'modelNo, quantity, and storeName are required' });
    }

    const storeInward = new StoreInward({
      modelNo,
      quantity,
      scanningCode,
      scannedBarcode,
      userId,
      storeName,
      brand,
      dealerPrice,
      mrp,
      model,
      subCategory,
      category,
      currentStock,
      pricePerUnit,
      salePerson,
      owner,
    });

    await storeInward.save();

    // Update Product quantity
    const product = await Product.findOne({ modelNo });
    if (product) {
      const newQuantity = product.quantity + Number(quantity);
      await Product.findOneAndUpdate(
        { modelNo },
        {
          quantity: newQuantity,
          stockStatus: newQuantity > 5 ? 'In Stock' : 'Low Stock',
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Store inward recorded successfully',
      data: storeInward,
    });
  } catch (error) {
    console.error('❌ Error in createStoreInward:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📦 Get All Store Inwards
exports.getAllStoreInwards = async (req, res) => {
  try {
    const { storeName } = req.query;
    const filter = storeName ? { storeName: new RegExp(`^${storeName}$`, 'i') } : {};
    const storeInwards = await StoreInward.find(filter).sort({ createdAt: -1 });
    res.status(200).json(storeInwards);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ❌ Delete Store Inward
exports.deleteStoreInward = async (req, res) => {
  try {
    const { id } = req.params;

    const storeInward = await StoreInward.findById(id);
    if (!storeInward) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    const { modelNo, quantity } = storeInward;

    // Reduce stock
    const product = await Product.findOne({ modelNo });
    if (product) {
      const newQuantity = Math.max(0, product.quantity - Number(quantity));
      await Product.findOneAndUpdate(
        { modelNo },
        {
          quantity: newQuantity,
          stockStatus:
            newQuantity > 5 ? 'In Stock' : newQuantity > 0 ? 'Low Stock' : 'Out of Stock',
        },
        { new: true }
      );
    }

    await StoreInward.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Store inward deleted and stock updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in deleteStoreInward:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📤 Create Stock Outward
exports.createStockOutward = async (req, res) => {
  try {
    const {
      modelNo,
      quantity,
      reason,
      userId,
      storeName,
      customerName,
      customerMobile,
      customerAddress,
      scannedCodes,
      scannedList,
      price,
      salePerson,
      category,
    } = req.body;

    if (!modelNo || !quantity || !storeName) {
      return res.status(400).json({
        success: false,
        error: 'modelNo, quantity, and storeName are required',
      });
    }

    const stockOutward = new StockOutward({
      modelNo,
      quantity,
      reason,
      userId,
      storeName,
      customerName,
      customerMobile,
      customerAddress,
      scannedCodes,
      scannedList,
      price,
      salePerson,
      category: category || "",
    });

    await stockOutward.save();

    const product = await Product.findOne({ modelNo });
    if (product) {
      const newQuantity = Math.max(0, product.quantity - Number(quantity));
      await Product.findOneAndUpdate(
        { modelNo },
        {
          quantity: newQuantity,
          stockStatus:
            newQuantity > 5 ? 'In Stock' : newQuantity > 0 ? 'Low Stock' : 'Out of Stock',
        },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Stock outward created successfully',
      data: stockOutward,
    });
  } catch (error) {
    console.error('❌ Error in createStockOutward:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Store Inward Record
exports.updateStoreInward = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, scannedBarcode, category, subCategory, owner } = req.body;
    // const { quantity, scannedBarcode } = req.body;

    const existing = await StoreInward.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Store Inward record not found" });
    }

    // Ensure quantity is not negative
    const newQuantity = Math.max(0, Number(quantity) || 0);

    // Update scannedBarcode (either string or array)
    let updatedScanned = [];
    if (Array.isArray(scannedBarcode)) {
      updatedScanned = scannedBarcode.filter(Boolean);
    } else if (typeof scannedBarcode === "string") {
      updatedScanned = scannedBarcode
        .split(",")
        .map(b => b.trim())
        .filter(Boolean);
    }

    const updated = await StoreInward.findByIdAndUpdate(
      id,
      {
        $set: {
          quantity: newQuantity,
          scannedBarcode: updatedScanned,
          category: category || existing.category,
          subCategory: subCategory !== undefined ? subCategory : existing.subCategory,
          owner: owner || existing.owner
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Store Inward record updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error updating Store Inward:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Store Inward record",
      error: error.message
    });
  }
};

// ❌ Delete Stock Outward (✅ Added)
exports.deleteStockOutward = async (req, res) => {
  try {
    const { id } = req.params;

    const stockOutward = await StockOutward.findById(id);
    if (!stockOutward) {
      return res.status(404).json({ success: false, message: 'Stock Outward record not found' });
    }

    await StockOutward.findByIdAndDelete(id);
    res.json({ success: true, message: 'Stock Outward record deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting Stock Outward:', error);
    res.status(500).json({ success: false, message: 'Failed to delete Stock Outward record', error: error.message });
  }
};
