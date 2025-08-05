const Lesen = require('../models/Lesen');

// Create a new Lesen document
exports.createLesen = async (req, res) => {
  try {
    const lesen = new Lesen(req.body);
    const savedLesen = await lesen.save();
    res.status(201).json(savedLesen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Lesen documents
exports.getAllLesen = async (req, res) => {
  try {
    const lesen = await Lesen.find();
    res.status(200).json(lesen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Lesen document by ID
exports.getLesenById = async (req, res) => {
  try {
    const lesen = await Lesen.findById(req.params.id);
    if (!lesen) {
      return res.status(404).json({ error: 'Lesen not found' });
    }
    res.status(200).json(lesen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Lesen document by ID
exports.updateLesen = async (req, res) => {
  try {
    const updatedLesen = await Lesen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLesen) {
      return res.status(404).json({ error: 'Lesen not found' });
    }
    res.status(200).json(updatedLesen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Lesen document by ID
exports.deleteLesen = async (req, res) => {
  try {
    const deletedLesen = await Lesen.findByIdAndDelete(req.params.id);
    if (!deletedLesen) {
      return res.status(404).json({ error: 'Lesen not found' });
    }
    res.status(200).json({ message: 'Lesen deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};