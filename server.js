const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

// Gunakan middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Sesuaikan dengan URL React Anda
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Tentukan lokasi penyimpanan gambar menggunakan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "images", "angel"));
  },
  filename: (req, file, cb) => {
    // Ambil ekstensi file
    const fileExtension = path.extname(file.originalname);

    // Bersihkan nama file dari spasi, karakter khusus, dan angka
    const cleanFileName = file.originalname
      .replace(fileExtension, "") // Hapus ekstensi
      .replace(/[^a-zA-Z]/g, "") // Hanya izinkan huruf
      .toLowerCase(); // Ubah ke lowercase

    // Gunakan nama file yang sudah dibersihkan + ekstensi
    const finalFileName = `${cleanFileName}${fileExtension}`;

    console.log("Generated filename:", finalFileName);
    cb(null, finalFileName);
  },
});

const upload = multer({ storage: storage });

// Endpoint untuk upload gambar
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.send({
    filePath: `/images/${req.file.filename}`, // Path relatif file yang di-upload
  });
});

// Menyajikan folder public sebagai file statis
app.use(express.static(path.join(__dirname, "public")));

// Menjalankan server pada port 5000
app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
