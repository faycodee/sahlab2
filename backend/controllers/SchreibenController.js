const Schreiben = require('../models/Schreiben');

// Enhanced debugging
console.log("Schreiben model:", Schreiben);
console.log("Schreiben type:", typeof Schreiben);
console.log("Is Schreiben a function?", typeof Schreiben === 'function');
console.log("Schreiben.find:", typeof Schreiben.find);

// Create a new Schreiben
exports.createSchreiben = async (req, res) => {
    try {
        console.log("Creating Schreiben with data:", req.body);
        console.log("Schreiben constructor check:", typeof Schreiben);
        
        const schreiben = new Schreiben(req.body);
        await schreiben.save();
        res.status(201).json(schreiben);
    } catch (err) {
        console.error("Error creating Schreiben:", err);
        res.status(400).json({ error: err.message });
    }
};

// Get all Schreiben
exports.getAllSchreiben = async (req, res) => {
    try {
       
        const schreiben = await Schreiben.find();
        res.status(200).json(schreiben);
    } catch (err) {
        console.error("Error getting Schreiben:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get a single Schreiben by ID
exports.getSchreibenById = async (req, res) => {
    try {
        const schreiben = await Schreiben.findById(req.params.id);
        if (!schreiben) {
            return res.status(404).json({ error: 'Schreiben not found' });
        }
        res.status(200).json(schreiben);
    } catch (err) {
        console.error("Error getting Schreiben by ID:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update a Schreiben by ID
exports.updateSchreiben = async (req, res) => {
    try {
        const schreiben = await Schreiben.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!schreiben) {
            return res.status(404).json({ error: 'Schreiben not found' });
        }
        res.status(200).json(schreiben);
    } catch (err) {
        console.error("Error updating Schreiben:", err);
        res.status(400).json({ error: err.message });
    }
};

// Delete a Schreiben by ID
exports.deleteSchreiben = async (req, res) => {
    try {
        const schreiben = await Schreiben.findByIdAndDelete(req.params.id);
        if (!schreiben) {
            return res.status(404).json({ error: 'Schreiben not found' });
        }
        res.status(200).json({ message: 'Schreiben deleted successfully' });
    } catch (err) {
        console.error("Error deleting Schreiben:", err);
        res.status(500).json({ error: err.message });
    }
};


