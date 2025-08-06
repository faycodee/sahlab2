const express = require('express');
const router = express.Router();
const LesenController = require('../controllers/LesenController');

// CRUD routes
router.post('/', LesenController.createLesen); // Create
router.get('/', LesenController.getAllLesen); // Read all
router.get('/:id', LesenController.getLesenById); // Read one by ID
router.put('/:id', LesenController.updateLesen); // Update by ID
router.delete('/:id', LesenController.deleteLesen); // Delete by ID
