const Hören = require("../models/Hören");

// Get all Hören documents
exports.getAll = async (req, res) => {
  try {
    const hören = await Hören.find();
    res.json(hören);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Hören document by ID
exports.getById = async (req, res) => {
  try {
    const hören = await Hören.findById(req.params.id);
    if (!hören) return res.status(404).json({ error: "Not found" });
    res.json(hören);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Hören document
exports.create = async (req, res) => {
  try {
    const hören = new Hören(req.body);
    await hören.save();
    res.status(201).json(hören);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Hören document by ID
exports.update = async (req, res) => {
  try {
    const hören = await Hören.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hören) return res.status(404).json({ error: "Not found" });
    res.json(hören);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Hören document by ID
exports.remove = async (req, res) => {
  try {
    const hören = await Hören.findByIdAndDelete(req.params.id);
    if (!hören) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};