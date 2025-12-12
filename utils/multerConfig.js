const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

function uuid() {
    return (
        Date.now().toString(16) +
        "-" +
        Math.random().toString(16).slice(2) +
        "-" +
        Math.random().toString(16).slice(2)
    );
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".pdf";
        cb(null, `${uuid()}${ext}`);
    }
});

const upload = multer({ storage });

module.exports = {
    upload,
    uploadDir
};
