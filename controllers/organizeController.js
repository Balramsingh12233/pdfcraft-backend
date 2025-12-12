const { mergePdfs } = require("../services/organizeService");
const { cleanupFiles } = require("../utils/cleanup");

const merge = async (req, res) => {
    if (!req.files || req.files.length < 2) {
        // Clean up uploaded files if validation fails
        if (req.files) cleanupFiles(req.files.map(f => f.path));
        return res.status(400).json({ error: "At least 2 files required" });
    }

    const filePaths = req.files.map(f => f.path);
    const fileBuffers = req.files.map(f => require('fs').readFileSync(f.path));

    try {
        const mergedBytes = await mergePdfs(fileBuffers);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="merged.pdf"'
        );
        res.send(Buffer.from(mergedBytes));

        // Cleanup input files after sending response
        // Using setTimeout to ensure response is fully sent before deleting (though res.send is sync-ish for buffers)
        setTimeout(() => cleanupFiles(filePaths), 1000);

    } catch (error) {
        console.error("Merge failed:", error);
        cleanupFiles(filePaths);
        res.status(500).json({ error: "Merge failed" });
    }
};

module.exports = {
    merge,
};
