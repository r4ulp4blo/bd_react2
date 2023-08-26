const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
/*Esta API es la encargada de administrar el guardado de los archivos que se envian desde los 2 principales componentes
1- InsetBooks
2- SaveImage
*/

//este se encarga de guardar el archivo pdf recibido en la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//administrando el espacio para subirlo
const upload = multer({ storage: storage });

//peticion post que recibe los datos dividiendo los datos text y el archivo PDF

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { titulo, autor, genero, enlaceImg, caracteristicas, estado } =
      req.body;
    const pdfFile = req.file;
    const enlace_pdf = pdfFile.originalname;

    //tambien es la encargada de proporcionarle los datos del libro que seran guardados por la API server.
    const response = await axios.post("http://localhost:5000/agregar-libro", {
      titulo,
      autor,
      caracteristicas,
      genero,
      enlaceImg,
      enlace_pdf,
      estado,
    });

    if (response.status === 201) {
      res.send("Libro guardado exitosamente en ambas APIs.");
    } else {
      res.status(500).send("Error al guardar el libro en la primera API.");
    }
  } catch (error) {
    console.error("Error al guardar el libro:", error);
    res.status(500).send("Error al guardar el libro en la segunda API.");
  }
});

//devuelve el archivo PDF que le solicitan(este se puede hacer prueba desde el componente: PdfViewer.jsx)
app.get("/pdf/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  res.sendFile(filePath);
});
//Guarda la imagen que se recibe en la carpeta images/
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imagenes/");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    req.generatedFileName = filename;
    cb(null, filename);
  },
});

const imageUpload = multer({ storage: imageStorage });
//recibe el archivo img y lo guarda
app.post("/upload-image", imageUpload.single("imagen"), async (req, res) => {
  try {
    const imagenFile = req.file;
    const idLibroSeleccionado = req.body.id_libro;
    const generatedFileName = req.generatedFileName;

    //se conecta a la API server.js para guardar el nombre de la imagen en la tabla libro
    const response = await axios.post(
      "http://localhost:5000/actualizar-enlace-img",
      {
        idLibroSeleccionado,
        generatedFileName,
      }
    );

    if (response.status === 200) {
      res.send("Libro guardado exitosamente en ambas APIs.");
    } else {
      res.status(500).send("Error al guardar el libro en la primera API.");
    }
  } catch (error) {
    console.error(
      "Error al subir la imagen o actualizar el enlace_img:",
      error
    );
    res
      .status(500)
      .send("Error al subir la imagen o actualizar el enlace_img.");
  }
});
//devuelve la imagen libro que se le esta pidiendo
app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "imagenes", filename);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
