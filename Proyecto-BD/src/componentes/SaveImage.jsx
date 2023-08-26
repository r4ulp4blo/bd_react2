import { useState, useEffect } from "react";
import axios from "axios";

const SaveImage = () => {
  const [libros, setLibros] = useState([]);
  const [mostrarFormularioImagen, setMostrarFormularioImagen] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [idLibroSeleccionado, setIdLibroSeleccionado] = useState(null); // Estado para almacenar el ID del libro seleccionado

  //obtiene los libros
  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const response = await axios.get("http://localhost:5000/libros");
        setLibros(response.data);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };

    obtenerLibros();
  }, []);

  //agrega un enlace de una imagen a la bd en la API server.js
  const handleAgregarImagen = (idLibro) => {
    setIdLibroSeleccionado(idLibro); // Al hacer clic en Agregar Imagen establece el ID del libro seleccionado
    setMostrarFormularioImagen(true);
  };

  const handleImagenChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const handleSubmitImagen = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("imagen", imagenFile);
      formData.append("id_libro", idLibroSeleccionado); // Agrega el ID del libro al FormData

      const response = await axios.post(
        "http://localhost:3000/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Accion realizada con exito");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al realizar la accion");
    }

    setMostrarFormularioImagen(false);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2 className="mb-4">Lista de Libros</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Título</th>
            <th>Género</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id_libro}>
              <td>{libro.titulo}</td>
              <td>{libro.genero}</td>
              <td>{libro.estado}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAgregarImagen(libro.id_libro)}
                >
                  Agregar Imagen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarFormularioImagen && (
        <div className=" row col-12 text-center">
          <h3>Subir Imagen</h3>
          <form encType="multipart/form-data" onSubmit={handleSubmitImagen}>
            <div className="form-group">
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                className="form-control-file"
                onChange={handleImagenChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Subir Imagen
            </button>
          </form>
        </div>
      )}

      <div>
        <a href="/" className="btn btn-primary my-5">
          Regresar
        </a>
      </div>
    </div>
  );
};

export default SaveImage;
