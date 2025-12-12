const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const { LIBREOFFICE_PATH } = require("../utils/paths");
const { cleanupFiles } = require("../utils/cleanup");

/**
 * Convert PDF to Word (Docx) using LibreOffice headless mode
 * @param {string} inputPath - Path to input PDF
 * @param {string} outputDir - Directory to save output
 * @returns {Promise<string>} - Path to the generated .docx file
 */
const convertPdfToWord = (inputPath, outputDir) => {
    return new Promise((resolve, reject) => {
        // libreoffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir <outputDir> <inputPath>
        const args = [
            "--headless",
            "--infilter=writer_pdf_import",
            "--convert-to",
            "docx",
            "--outdir",
            outputDir,
            inputPath,
        ];

        console.log(`Running LibreOffice conversion: ${LIBREOFFICE_PATH} ${args.join(" ")}`);

        execFile(LIBREOFFICE_PATH, args, (error, stdout, stderr) => {
            if (error) {
                console.error("LibreOffice Error:", error);
                return reject(error);
            }

            // LibreOffice saves the file with the same basename but .docx extension
            const inputName = path.parse(inputPath).name;
            const outputPath = path.join(outputDir, `${inputName}.docx`);

            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error("Output file was not created by LibreOffice"));
            }
        });
    });
};

module.exports = {
    convertPdfToWord,
};
