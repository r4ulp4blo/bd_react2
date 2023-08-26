import NavBar from "../componentes/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

function Home() {
  const [libros, setLibros] = useState([]);
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
      <div className="mb-5">
        <NavBar />
      </div>
      <div className="row mt-5">
        {libros.slice(0, 4).map((libro, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div className="card" style={{ width: "18rem", marginTop: "20px" }}>
              <img
                style={{
                  width: "285px",
                  height: "300px",
                  objectFit: "cover",
                }}
                src={`http://localhost:3000/images/${libro.enlace_img}`}
                className="card-img-top"
                alt={`Imagen del libro ${libro.titulo}`}
              />
              <div className="card-body">
                <h5 className="card-title">{libro.titulo}</h5>
                <p className="card-text">{libro.estado}</p>
                <a href="#" className="btn btn-primary">
                  Ver mas
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
