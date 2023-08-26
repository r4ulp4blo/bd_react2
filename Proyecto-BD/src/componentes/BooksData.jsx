import { useState, useEffect } from "react";
import axios from "axios";
import ImagenComponent from "./ImagenComponent";

function LibrosComponent() {
  const [libros, setLibros] = useState([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // obtiene los libros
  const fetchLibros = () => {
    axios
      .get("http://localhost:5000/libros", libros)
      .then((response) => {
        setLibros(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener libros:", error);
      });
  };
  useEffect(() => {
    fetchLibros();
  }, []);

  return (
    <div className="container">
      <div className="">
        <h1>Lista de Libros</h1>
        <div className="form-group row justify-content-end">
          <label className="col-auto col-form-label">
            Filtrar por Categoría:
          </label>
          <div className="col-auto">
            <select
              name="categoria"
              className="form-control form-control-sm"
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
              }}
            >
              <option value="">Todas las categorías</option>
              <option value="Ciencia Ficción">Ciencia Ficción</option>
              <option value="Thriller Psicológico">Thriller Psicológico</option>
              <option value="Novela de Misterio">Novela de Misterio</option>
              <option value="Novela Romántica">Novela Romántica</option>
              <option value="Literatura de Ciencia Ficción Dystópica">
                Literatura de Ciencia Ficción Dystópica
              </option>
              <option value="Novela de Aventuras">Novela de Aventuras</option>
            </select>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Solicitar</th>
            </tr>
          </thead>
          <tbody>
            {libros.length > 0 ? (
              libros.filter(
                (libro) =>
                  !categoriaSeleccionada ||
                  libro.genero === categoriaSeleccionada
              ).length > 0 ? (
                libros.map((libro) => {
                  if (
                    !categoriaSeleccionada ||
                    libro.genero === categoriaSeleccionada
                  ) {
                    return (
                      <tr key={libro.id_libro}>
                        <td>
                          {/*Este es un componente que se encarga de recibir la imagen y presentarla*/}
                          <ImagenComponent filename={libro.enlace_img} />
                        </td>
                        <td>{libro.titulo}</td>
                        <td>{libro.estado}</td>
                        <td>
                          <button className="btn btn-primary mt-2">
                            Prestar libro
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay libros disponibles para la categoría seleccionada.
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibrosComponent;
