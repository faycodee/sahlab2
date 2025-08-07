const express = require('express');
const router = express.Router();
const schreibenController = require('../controllers/SchreibenController');

// Create a new Schreiben
router.post('/', schreibenController.createSchreiben);

// Get all Schreiben
router.get('/', schreibenController.getAllSchreiben);

// Get a single Schreiben by ID
router.get('/:id', schreibenController.getSchreibenById);

// Update a Schreiben by ID
router.put('/:id', schreibenController.updateSchreiben);

// Delete a Schreiben by ID
router.delete('/:id', schreibenController.deleteSchreiben);

module.exports = router;
