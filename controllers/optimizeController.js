const path = require("path");
const fs = require("fs");
const { compressPdf } = require("../services/optimizeService");
const { cleanupFiles } = require("../utils/cleanup");
const { uploadDir } = require("../utils/multerConfig");

const compress = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(
        uploadDir,
        `${path.parse(req.file.filename).name}-compressed.pdf`
    );

    const quality = req.body.quality || "ebook";

    try {
        await compressPdf(inputPath, outputPath, quality);

        res.download(
            outputPath,
            `${path.parse(req.file.originalname).name}-compressed.pdf`,
            (err) => {
                cleanupFiles([inputPath, outputPath]);
                if (err) console.error("Download error:", err);
            }
        );
    } catch (error) {
        console.error("Compression failed:", error);
        cleanupFiles([inputPath, outputPath]);
        res.status(500).json({ error: "Compression failed" });
    }
};

module.exports = {
    compress,
};
