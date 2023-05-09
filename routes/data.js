var express = require("express");
var router = express.Router();

// Multer para subida de archivos
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// XLSX para manejo de archivos Excel
const xlsx = require("xlsx");
// Mongoose para manejo de MongoDB
const mongoose = require("mongoose");
// Conexión abierta de MongoDB para manejar todas las peticiones
mongoose
    .connect(
      "mongodb+srv://admin2023:admin2023@rainth-test-cluster.6abyclm.mongodb.net/?retryWrites=true&w=majority",
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
      info: String,
    },
  ],
});
// Modelo del schema
const workbookModel = mongoose.model("WbRequest", workbookSchema);

router.post("/upload", upload.single("file"), async function (req, res, next) {
  const filePath = xlsx.readFile(req.file.path);

  try {
    // Crear el documento del pedido con el estado "pendiente"
    const nuevoObjeto = await workbookModel.create({});
    // Devolver solo el ID del documento como respuesta inicial
    res.status(201).json({ id: nuevoObjeto._id });
    processXLSXFile(filePath, nuevoObjeto._id);
  } catch(error) {
    // Manejo interno de errores
    console.error('Error al subir el objeto a MongoDB: ', error);
    res.status(500).json({error: 'Error de base de datos'});
  }
  
});

async function processXLSXFile(filePath, objetoId){
  try {
    const sheet_name_list = filePath.SheetNames;
    const data = xlsx.utils.sheet_to_json(filePath.Sheets[sheet_name_list[0]]);
    data.forEach((row) => {
      row.Edad = Number(row.Edad);
    });
    data.forEach((row) => {
      row.Nums = row.Nums.split(",").map((value) => Number(value.trim()));
    });
    console.log('calling');
    const result = await resolveAfter10Seconds();
    console.log(result);
    await workbookModel.findByIdAndUpdate(objetoId, { 
      estado: 'done', 
      datos: data
    });
    console.log(data);
  } catch(error) {
    // Manejo interno de errores
    console.error('Error al procesar el archivo XLXS: ', error);
    await workbookModel.findByIdAndUpdate(objetoId, { estado: 'done', errores: error });
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
