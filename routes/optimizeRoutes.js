const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multerConfig");
const { compress } = require("../controllers/optimizeController");

router.post("/compress", upload.single("file"), compress);

module.exports = router;
