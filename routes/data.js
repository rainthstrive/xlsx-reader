// Dependencias para procesamiento de Excel
const cargarArchivoXLSX = require("../xlsx_processing/processing.js")
// Uso de librería Express
var express = require("express");
var router = express.Router();
// Uso de librería dotenv
require('dotenv').config();
// Multer para subida de archivos
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Mongoose para manejo de MongoDB
const mongoose = require("mongoose");
// Conexión abierta de MongoDB para manejar todas las peticiones
mongoose
    .connect(
      process.env.DBCONN,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Conexión exitosa a MongoDB");
    })
    .catch((error) => {
      console.error("Error al conectar a MongoDB: ", error);
    });
// Definición del schema para MongoDB
const workbookSchema = new mongoose.Schema({
  estado: {
    type: String,
    enum: ["pending", "processing", "done"],
    default: "pending",
  },
  datos: [
    {
      Nombre: String,
      Edad: Number,
      Nums: [Number],
    },
  ],
  errores: [
    {
      fila: Number,
      columna: String,
      mensaje: String
    },
  ],
});
// Modelo del schema
const workbookModel = mongoose.model("WbRequest", workbookSchema);

router.post("/upload", upload.single("file"), async function (req, res, next) {
  try {
    // Crear el documento del pedido con el estado "pendiente"
    const nuevoObjeto = await workbookModel.create({});
    // Devolver solo el ID del documento como respuesta inicial
    res.status(201).json({ id: nuevoObjeto._id });
    processXLSXFile(req.file.path, nuevoObjeto._id);
  } catch(error) {
    // Manejo interno de errores
    console.error('Error al subir el objeto a MongoDB: ', error);
    res.status(500).json({error: 'Error de base de datos'});
  }
  
});

async function processXLSXFile(in_filePath, objetoId){
  try {
    // Comienza procesamiento de Excel //
    const data = cargarArchivoXLSX(in_filePath);
    // Termina procesamiento de Excel //
    console.log('calling');
    const result = await resolveAfter10Seconds();
    console.log(result);
    await workbookModel.findByIdAndUpdate(objetoId, { 
      estado: 'done', 
      datos: data.data,
      errores: data.errores
    });
    console.log(data);
  } catch(error) {
    // Manejo interno de errores
    console.error('Error al procesar el archivo XLXS: ', error);
  }
}

function resolveAfter10Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 10000);
  });
}

module.exports = router;
