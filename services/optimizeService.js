const { execFile } = require("child_process");
const path = require("path");
const { GHOSTSCRIPT_PATH } = require("../utils/paths");
const { cleanupFiles } = require("../utils/cleanup");

/**
 * Compress PDF using Ghostscript
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {string} qualityPreset - screen, ebook, printer, prepress
 * @returns {Promise<void>}
 */
const compressPdf = (inputPath, outputPath, qualityPreset = "ebook") => {
    return new Promise((resolve, reject) => {
        let pdfSettings = "/ebook";
        const mode = qualityPreset.toLowerCase();

        if (mode === "screen") pdfSettings = "/screen";
        if (mode === "printer") pdfSettings = "/printer";
        if (mode === "prepress") pdfSettings = "/prepress";

        const args = [
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            `-dPDFSETTINGS=${pdfSettings}`,
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            `-sOutputFile=${outputPath}`,
            inputPath,
        ];

        execFile(GHOSTSCRIPT_PATH, args, (error) => {
            if (error) {
                console.error("Ghostscript error:", error);
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    compressPdf,
};
