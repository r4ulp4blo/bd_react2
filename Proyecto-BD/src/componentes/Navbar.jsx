function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top mb-4">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="/val1" className="nav-link btn btn-primary text-light">
              Ingresa datos de libros
            </a>
          </li>
          <li className="nav-item">
            <a href="/val2" className="nav-link btn btn-primary text-light">
              Ingresa imagen a los libros
            </a>
          </li>
          <li className="nav-item">
            <a href="/val3" className="nav-link btn btn-primary text-light">
              Resultado
            </a>
          </li>
          <li className="nav-item">
            <a href="/val4" className="nav-link btn btn-primary text-light">
              otros elementos
            </a>
          </li>
        </ul>
        <div className="login-container">
          <a href="/val4" className="btn btn-primary m-3">
            Iniciar Sesion
          </a>
          <a href="/val5" className="btn btn-primary">
            Registrarme
          </a>
        </div>
      
        
      
      </div>
    </nav>
  );
}

export default Navbar;
