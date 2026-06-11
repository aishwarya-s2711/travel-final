const multer = require('multer');

// ── Multer config — store in memory (convert to base64 for MongoDB) ──────────
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, GIF, SVG allowed.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,   // 10 MB per file
    files: 10,                     // Max 10 files per request
  },
});

// ── Convert multer file buffer to base64 data URL ────────────────────────────
function bufferToBase64(file) {
  if (!file || !file.buffer) return '';
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

// ── Upload field configs ─────────────────────────────────────────────────────
const packageImageUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 },
]);

module.exports = {
  upload,
  bufferToBase64,
  packageImageUpload,
};
