const express = require("express");
const router = express.Router();
const hörenController = require("../controllers/hörenController");

// GET all
router.get("/", hörenController.getAll);

// GET by ID
router.get("/:id", hörenController.getById);

// POST create
router.post("/", hörenController.create);

// PUT update
router.put("/:id", hörenController.update);

// DELETE remove
router.delete("/:id", hörenController.remove);

module.exports = router;