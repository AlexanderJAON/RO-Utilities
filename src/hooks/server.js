import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// 📌 Configurar CORS para permitir solicitudes desde el frontend
app.use(cors());

// 📌 Configurar subida de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📌 Configurar transporte de correo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // 📌 Configurar en .env
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Ruta para recibir y enviar el archivo por correo
app.post("/send-email", upload.single("file"), async (req, res) => {
  try {
    console.log("📌 Archivo recibido:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "alexanderosma06@gmail.com",
      subject: "Reporte de Inspección",
      text: "Adjunto el reporte de inspección.",
      attachments: [{ filename: req.file.filename, path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito");

    // 🔥 Eliminar el archivo después de enviarlo
    fs.unlinkSync(filePath);
    console.log(`🗑️ Archivo eliminado: ${filePath}`);

    res.status(200).json({ message: "Correo enviado y archivo eliminado" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ message: "Error al enviar correo", error });
  }
});

// 📌 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
