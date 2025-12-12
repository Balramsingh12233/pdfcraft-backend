const path = require("path");
const os = require("os");

const isWindows = process.platform === "win32";

// Ghostscript Path
// Local: C:\Users\balra\Downloads\gswin64c-9.55.0-bin\gswin64c.exe
// Production (Linux/Docker): gs
const GHOSTSCRIPT_PATH = isWindows
    ? "C:\\Users\\balra\\Downloads\\gswin64c-9.55.0-bin\\gswin64c.exe"
    : "gs";

// LibreOffice Path
// Local: Standard installation path or reliant on PATH
// Production: libreoffice
const LIBREOFFICE_PATH = isWindows
    ? "C:\\Program Files\\LibreOffice\\program\\soffice.exe" // Common default, needing verification if user has it installed
    : "libreoffice";

module.exports = {
    GHOSTSCRIPT_PATH,
    LIBREOFFICE_PATH,
    isWindows,
};
