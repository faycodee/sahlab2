const express = require("express");
const router = express.Router();
const horenController = require("../controllers/horenController");

// GET all
router.get("/", horenController.getAll);

// GET by ID
router.get("/:id", horenController.getById);

// POST create
router.post("/", horenController.create);

// PUT update
router.put("/:id", horenController.update);

// DELETE remove
router.delete("/:id", horenController.remove);

module.exports = router;