const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const inputPath = path.join(__dirname, "dummy.pdf");
const outputPath = path.join(__dirname, "dummy-compressed.pdf");

const gsCommand = "C:\\Users\\balra\\Downloads\\gswin64c-9.55.0-bin\\gswin64c.exe";

const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    "-dPDFSETTINGS=/screen",
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outputPath}`,
    inputPath,
];

console.log("Running Ghostscript command...");
console.log(gsCommand, args.join(" "));

execFile(gsCommand, args, (error, stdout, stderr) => {
    if (error) {
        console.error("Ghostscript Error:", error);
        return;
    }
    console.log("Ghostscript finished.");
    if (fs.existsSync(outputPath)) {
        console.log("SUCCESS: Output file created at", outputPath);
        console.log("Size:", fs.statSync(outputPath).size, "bytes");
    } else {
        console.error("FAILURE: Output file NOT found.");
    }
});
