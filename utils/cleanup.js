const fs = require("fs");

function cleanupFiles(paths) {
    if (!Array.isArray(paths)) {
        paths = [paths];
    }
    paths.forEach((p) => {
        if (p && fs.existsSync(p)) {
            fs.unlink(p, (err) => {
                if (err) console.error(`Failed to cleanup file ${p}:`, err);
            });
        }
    });
}

module.exports = { cleanupFiles };
