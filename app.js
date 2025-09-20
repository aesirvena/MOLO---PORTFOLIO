const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, uploads)
app.use(express.static(path.join(__dirname, "public")));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config: Always overwrite profile.jpg in public/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, "profile.jpg");
  },
});
const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('profile'), (req, res) => {
  // Remove all other images except profile.jpg (cleanup, optional)
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      if (file !== "profile.jpg") {
        fs.unlink(path.join(uploadsDir, file), () => {});
      }
    });
  });

  // Redirect to home (index.html)
  res.redirect('/');
});

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});