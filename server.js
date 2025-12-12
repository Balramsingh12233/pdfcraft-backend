// server.js - main Express app for all PDF tools

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { execFile } = require("child_process");

const app = express();
const PORT = process.env.PORT || 4000;

// ----- Common setup -----
app.use(cors());
app.use(express.json());

// temp uploads directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// simple uuid helper
function uuid() {
  return (
    Date.now().toString(16) +
    "-" +
    Math.random().toString(16).slice(2) +
    "-" +
    Math.random().toString(16).slice(2)
  );
}

function cleanupFiles(paths) {
  paths.forEach((p) => {
    if (p && fs.existsSync(p)) {
      fs.unlink(p, () => {});
    }
  });
}

// Multer storage (shared)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `${uuid()}${ext}`);
  }
});
const upload = multer({ storage });

// ----- Health check -----
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


// POST /api/merge
app.post("/api/merge", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "At least 2 files required" });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="merged.pdf"'
    );
    res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Merge failed" });
  }
});

// =======================
//  Compress PDF endpoint
// =======================

app.post("/api/compress", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const inputPath = req.file.path;
  const outputPath = path.join(
    uploadDir,
    `${path.parse(req.file.filename).name}-compressed.pdf`
  );

  // quality from client: high / medium / low
  const level = req.body.quality || "medium";
  let pdfSettings = "/ebook";
  if (level === "high") pdfSettings = "/screen";
  if (level === "low") pdfSettings = "/printer";

  const gsCommand =
    process.platform === "win32"
      ? "C:\\Users\\balra\\Downloads\\gswin64c-9.55.0-bin\\gswin64c.exe"
      : "gs";

  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=${pdfSettings}`,
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outputPath}`,
    inputPath
  ];

  execFile(gsCommand, args, (error) => {
    if (error) {
      console.error("Ghostscript error:", error);
      cleanupFiles([inputPath, outputPath]);
      return res.status(500).json({ error: "Compression failed" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.parse(req.file.originalname).name}-compressed.pdf"`
    );

    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);

    res.on("finish", () => {
      cleanupFiles([inputPath, outputPath]);
    });
  });
});

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`PDFCraft backend running on http://localhost:${PORT}`);
});
