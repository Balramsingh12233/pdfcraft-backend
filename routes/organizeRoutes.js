const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multerConfig");
const { merge } = require("../controllers/organizeController");

router.post("/merge", upload.array("files"), merge);

module.exports = router;
