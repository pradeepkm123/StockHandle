const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// Multer storage: uploads/<timestamp><ext>
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CREATE (multipart)
router.post('/', upload.single('productImage'), async (req, res) => {
  try {
    const body = req.body;
    const img = req.file ? req.file.filename : null;

    const prod = await Product.create({
      ...body,
      mrp: body.mrp ? Number(body.mrp) : 0,
      dealerPrice: body.dealerPrice ? Number(body.dealerPrice) : 0,
      reorderLevel: body.reorderLevel ? Number(body.reorderLevel) : 0,
      productImage: img
    });

    res.status(201).json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed' });
  }
});

// READ ALL
router.get('/', async (_req, res) => {
  const list = await Product.find().sort({ createdAt: -1 });
  res.json(list);
});

// UPDATE (accepts multipart **or** JSON)
router.put('/:id', upload.single('productImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: 'Not found' });

    let productImage = existing.productImage;
    if (req.file) {
      // remove old file if present
      if (productImage) {
        const oldPath = path.join(__dirname, '..', 'uploads', productImage);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      productImage = req.file.filename;
    } else if (req.body.productImage) {
      // if client sent a string, keep only the basename
      productImage = path.basename(String(req.body.productImage));
    }

    const update = {
      ...req.body,
      mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : existing.mrp,
      dealerPrice:
        req.body.dealerPrice !== undefined ? Number(req.body.dealerPrice) : existing.dealerPrice,
      reorderLevel:
        req.body.reorderLevel !== undefined ? Number(req.body.reorderLevel) : existing.reorderLevel,
      productImage
    };

    const out = await Product.findByIdAndUpdate(id, update, { new: true });
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (prod?.productImage) {
      const p = path.join(__dirname, '..', 'uploads', prod.productImage);
      fs.existsSync(p) && fs.unlinkSync(p);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
