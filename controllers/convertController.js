const path = require("path");
const fs = require("fs");
const { convertPdfToWord } = require("../services/convertService");
const { cleanupFiles } = require("../utils/cleanup");

const pdfToWord = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputDir = path.dirname(inputPath); // Use same temp dir

    try {
        const outputPath = await convertPdfToWord(inputPath, outputDir);

        res.download(outputPath, `${path.parse(req.file.originalname).name}.docx`, (err) => {
            // Cleanup both input PDF and output Docx after download
            cleanupFiles([inputPath, outputPath]);
            if (err) console.error("Download error:", err);
        });
    } catch (error) {
        console.error("Conversion failed:", error);
        cleanupFiles([inputPath]);
        res.status(500).json({ error: "Conversion failed. Ensure LibreOffice is installed." });
    }
};

module.exports = {
    pdfToWord,
};
