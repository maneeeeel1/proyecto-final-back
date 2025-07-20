const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryMiddleware");
const { createProduct } = require("../controllers/productControllers");
const { updateProduct } = require("../controllers/productControllers");
const { getProducts } = require("../controllers/productControllers");
const { deleteProduct } = require("../controllers/productControllers");
const isAuthenticated = require("../middleware/authMiddleware");


router.post("/", isAuthenticated, upload.single("imagen"), createProduct);
router.get("/", getProducts);
router.delete("/:id", isAuthenticated, deleteProduct);
router.put("/:id", isAuthenticated, upload.single("imagen"), updateProduct);

module.exports = router;