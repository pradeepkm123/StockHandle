const StockOutward = require('../models/StockOutward');
const Product = require('../models/Product');

// Create new Stores Outward entry
exports.createStoresOutward = async (req, res) => {
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
            subCategory,
        } = req.body;

        console.log("Incoming Stores Outward Request:", req.body);

        // 1. Validation
        if (!modelNo || !quantity || !storeName || !customerName) {
            return res.status(400).json({
                success: false,
                error: "Required fields: modelNo, quantity, storeName, customerName",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                error: "Quantity must be greater than 0",
            });
        }

        // 2. Create StockOutward Record
        const stockOutward = new StockOutward({
            modelNo,
            quantity,
            reason: reason || "Store Sale",
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
            subCategory: subCategory || "",
        });

        await stockOutward.save();

        // 3. Update Product Stock (Reorder Level as Quantity)
        // Using 'model' field as per Product schema
        const product = await Product.findOne({ model: { $regex: new RegExp(`^${modelNo}$`, 'i') } });

        if (product) {
            const currentLevel = product.reorderLevel || 0;
            const newLevel = Math.max(0, currentLevel - quantity);

            product.reorderLevel = newLevel;

            // Update stock status based on new level
            if (newLevel === 0) {
                product.stockStatus = "Out of Stock";
            } else if (newLevel <= 5) {
                product.stockStatus = "Low Stock";
            } else {
                product.stockStatus = "In Stock";
            }

            await product.save();
            console.log(`Updated Product ${modelNo} stock to ${newLevel}`);
        } else {
            console.warn(`Product ${modelNo} not found in Products collection, skipping stock update.`);
        }

        res.status(201).json({
            success: true,
            message: "Stores Outward recorded successfully",
            data: stockOutward,
        });

    } catch (error) {
        console.error("Error in createStoresOutward:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Server error"
        });
    }
};
