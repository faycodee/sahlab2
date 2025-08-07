const Lesen = require('../models/Lesen');

// Create a new Lesen document
exports.createLesen = async (req, res) => {
  try {
    // Validate the structure before saving
    const { teile, sprachb, ...otherData } = req.body;
    
    // Ensure arrays exist for teile sections
    const validatedData = {
      ...otherData,
      teile: {
        teil1: Array.isArray(teile?.teil1) ? teile.teil1 : [],
        teil2: Array.isArray(teile?.teil2) ? teile.teil2 : [],
        teil3: Array.isArray(teile?.teil3) ? teile.teil3 : [],
      },
      sprachb: {
        teil1: Array.isArray(sprachb?.teil1) ? sprachb.teil1 : [],
        teil2: Array.isArray(sprachb?.teil2) ? sprachb.teil2 : [],
      }
    };

    const lesen = new Lesen(validatedData);
    const savedLesen = await lesen.save();
    res.status(201).json(savedLesen);
  } catch (err) {
    console.error('Error creating Lesen:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all Lesen documents
exports.getAllLesen = async (req, res) => {
  try {
    const lesen = await Lesen.find();
    res.status(200).json(lesen);
  } catch (err) {
    console.error('Error fetching all Lesen:', err);
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
    console.error('Error fetching Lesen by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a Lesen document by ID
exports.updateLesen = async (req, res) => {
  try {
    const { teile, sprachb, ...otherData } = req.body;
    
    // Ensure arrays exist for teile sections
    const validatedData = {
      ...otherData,
      teile: {
        teil1: Array.isArray(teile?.teil1) ? teile.teil1 : [],
        teil2: Array.isArray(teile?.teil2) ? teile.teil2 : [],
        teil3: Array.isArray(teile?.teil3) ? teile.teil3 : [],
      },
      sprachb: {
        teil1: Array.isArray(sprachb?.teil1) ? sprachb.teil1 : [],
        teil2: Array.isArray(sprachb?.teil2) ? sprachb.teil2 : [],
      }
    };

    const updatedLesen = await Lesen.findByIdAndUpdate(
      req.params.id, 
      validatedData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedLesen) {
      return res.status(404).json({ error: 'Lesen not found' });
    }
    res.status(200).json(updatedLesen);
  } catch (err) {
    console.error('Error updating Lesen:', err);
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
    console.error('Error deleting Lesen:', err);
    res.status(500).json({ error: err.message });
  }
};