const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;

// Configurar armazenamento multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Servir arquivos estáticos
app.use(express.static('.'));

// Endpoint para upload de logo
app.post('/upload/logo', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No file uploaded' 
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log(`📁 Logo uploaded: ${imageUrl}`);

  res.json({
    success: true,
    imageUrl: imageUrl,
    message: 'Logo uploaded successfully'
  });
});

// Endpoint para upload de background
app.post('/upload/background', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No file uploaded' 
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log(`🖼️ Background uploaded: ${imageUrl}`);

  res.json({
    success: true,
    imageUrl: imageUrl,
    message: 'Background uploaded successfully'
  });
});

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Upload server running on http://localhost:${PORT}`);
  console.log(`📂 Serving files from: ${process.cwd()}`);
});