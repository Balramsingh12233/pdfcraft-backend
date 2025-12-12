const express = require("express");
const router = express.Router();
const { upload } = require("../utils/multerConfig");
const { pdfToWord } = require("../controllers/convertController");

router.post("/pdf-to-word", upload.single("file"), pdfToWord);

module.exports = router;
