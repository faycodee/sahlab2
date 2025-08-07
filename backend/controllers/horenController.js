const Horen = require("../models/Horen");

// Get all Hören documents
exports.getAll = async (req, res) => {
  try {
    const horen = await Horen.find();
    res.json(horen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Hören document by ID
exports.getById = async (req, res) => {
  try {
    const horen = await Horen.findById(req.params.id);
    if (!horen) return res.status(404).json({ error: "Not found" });
    res.json(horen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Hören document
exports.create = async (req, res) => {
  try {
    const horen = new Horen(req.body);
    await horen.save();
    res.status(201).json(horen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update a Hören document by ID
exports.update = async (req, res) => {
  try {
    const horen = await Horen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!horen) return res.status(404).json({ error: "Not found" });
    res.json(horen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Hören document by ID
exports.remove = async (req, res) => {
  try {
    const horen = await Horen.findByIdAndDelete(req.params.id);
    if (!horen) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};