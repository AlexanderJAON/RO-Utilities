import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Asegurar que la carpeta "uploads" exista
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📌 Función para eliminar archivos antiguos antes de guardar uno nuevo
const cleanUploadFolder = () => {
  const files = fs.readdirSync(uploadDir);
  files.forEach((file) => {
    const filePath = path.join(uploadDir, file);
    fs.unlinkSync(filePath);
    console.log(`🗑️ Archivo eliminado: ${filePath}`);
  });
};

// 📌 Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cleanUploadFolder(); // 🔥 Limpiar carpeta antes de guardar
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 Configurar transporte de correo con Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false para TLS
  auth: {
    user: "khritos27@gmail.com",
    pass: "tlst sfjx vnbj qpok",
  },
  debug: true,
  logger: true,
});

// 📌 Endpoint para recibir el archivo y enviarlo por correo
app.post("/send-email", upload.single("file"), async (req, res) => {
  try {
    console.log("📌 Archivo recibido en el backend:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    const mailOptions = {
      from: "khritos27@gmail.com",
      to: "alexanderosma06@gmail.com",
      subject: "Reporte de Inspección",
      text: "Adjunto el reporte de inspección.",
      attachments: [{ filename: req.file.filename, path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito");

    // 🔥 Eliminar el archivo después de enviarlo
    fs.unlinkSync(filePath);
    console.log(`🗑️ Archivo enviado y eliminado: ${filePath}`);

    res.status(200).json({ message: "Correo enviado y archivo eliminado" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ message: "Error al enviar correo", error });
  }
});

// 📌 Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));
