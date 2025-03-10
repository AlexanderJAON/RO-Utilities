import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// 📌 Configurar subida de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const uploadDir = isProduction ? "/tmp" : path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

console.log("📌 Carpeta de subida:", uploadDir);

// 📌 Configuración de transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Ruta para recibir el archivo y enviarlo por correo
app.post("/api/send-email", upload.single("file"), async (req, res) => {
  try {
    console.log("📌 Archivo recibido:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "jhonalexander.osma@ingredion.com",           //alexanderosma06@gmail.com
      subject: "📌 Reporte de Inspección",
      text: "Adjunto el reporte de inspección.",
      attachments: [{ filename: req.file.originalname, path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito");

    fs.unlinkSync(filePath);
    console.log(`🗑️ Archivo eliminado: ${filePath}`);

    res.status(200).json({ message: "📧 Correo enviado correctamente" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ message: "❌ Error al enviar correo", error });
  }
});

// 📌 Si está en Vercel, exportamos `app`, si no, ejecutamos el servidor localmente
if (!isProduction) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
