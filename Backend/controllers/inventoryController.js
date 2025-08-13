const Inventory = require('../models/Inventory');

// ✅ Create new inventory record
exports.createInventory = async (req, res) => {
  try {
    const {
      modelNo,
      location,
      quantity,
      shd,
      scannedCodes,
      brand,
      dealerPrice,
      mrp,
      model,
      subCategory,
      category,
      currentStock
    } = req.body;

    const inventory = new Inventory({
      modelNo,
      location,
      quantity: Number(quantity),
      shd,
      scannedCodes,
      brand,
      dealerPrice: Number(dealerPrice),
      mrp: Number(mrp),
      model,
      subCategory,
      category,
      currentStock: Number(currentStock),
    });

    await inventory.save();
    res.status(201).send(inventory);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// ✅ Get all inventory records
exports.getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.send(inventories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ✅ Update inventory record
exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inventory) return res.status(404).send({ message: "Not found" });
    res.send(inventory);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// ✅ Delete inventory record
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) return res.status(404).send({ message: "Not found" });
    res.send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
